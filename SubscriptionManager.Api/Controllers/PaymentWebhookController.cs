using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Enums;
using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentWebhookController : ControllerBase
{
    private readonly IAppDbContext _context;
    private readonly IWebhookService _webhookService;
    private readonly ILogger<PaymentWebhookController> _logger;

    public PaymentWebhookController(IAppDbContext context, IWebhookService webhookService, ILogger<PaymentWebhookController> logger)
    {
        _context = context;
        _webhookService = webhookService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Index()
    {
        using var ms = new MemoryStream();
        await HttpContext.Request.Body.CopyToAsync(ms);
        var rawBytes = ms.ToArray();
        var json = Encoding.UTF8.GetString(rawBytes);

        var signature = Request.Headers["x-webhook-signature"].FirstOrDefault() ?? string.Empty;
        var timestamp = Request.Headers["x-webhook-timestamp"].FirstOrDefault() ?? string.Empty;

        var settings = await _context.PlatformSettings.FirstOrDefaultAsync();
        if (settings == null || string.IsNullOrEmpty(settings.CashfreeSecretKey))
        {
            _logger.LogError("Platform Settings not configured with Cashfree Keys.");
            return BadRequest();
        }

        if (!VerifySignature(json, timestamp, signature, settings.CashfreeSecretKey))
        {
            _logger.LogWarning("Invalid webhook signature from Cashfree. Timestamp: {Timestamp}, Signature: {Signature}, PayloadLength: {Length}", timestamp, signature, json.Length);
            // In Test/Sandbox environment, sometimes the Test button sends dummy signature.
            // We will allow it ONLY if it's explicitly missing/dummy and we are in dev, but for now we enforce it.
            return Unauthorized(new { Message = "Signature verification failed", Timestamp = timestamp, Signature = signature });
        }

        try
        {
            using var jsonDoc = JsonDocument.Parse(json);
            var root = jsonDoc.RootElement;

            if (root.TryGetProperty("type", out var typeProp))
            {
                var eventType = typeProp.GetString()?.ToUpperInvariant();
                if (eventType == "SUBSCRIPTION_NEW" || 
                    eventType == "SUBSCRIPTION_PAYMENT_SUCCESS" || 
                    eventType == "SUBSCRIPTION_STATUS_CHANGED" ||
                    eventType == "SUBSCRIPTION_AUTH_STATUS")
                {
                    if (root.TryGetProperty("data", out var dataProp) && dataProp.TryGetProperty("subscription", out var subProp))
                    {
                        var subscriptionId = subProp.GetProperty("subscription_id").GetString();
                        if (!string.IsNullOrEmpty(subscriptionId) && subscriptionId.StartsWith("sub_"))
                        {
                            // If the subscription exists already, we might not want to recreate it. 
                            // HandleSubscriptionSuccessAsync handles this (we should ensure it checks if exists)
                            await HandleSubscriptionSuccessAsync(subscriptionId);
                        }
                    }
                }
            }
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Internal Webhook Error");
            return StatusCode(500);
        }
    }

    private bool VerifySignature(string payload, string timestamp, string signature, string secretKey)
    {
        try
        {
            string data = timestamp + payload;
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey));
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            var expectedSignature = Convert.ToBase64String(hashBytes);
            return signature == expectedSignature;
        }
        catch
        {
            return false;
        }
    }

    private async Task HandleSubscriptionSuccessAsync(string cashfreeSubscriptionId)
    {
        var parts = cashfreeSubscriptionId.Split('_');
        if (parts.Length >= 3 && Guid.TryParse(parts[1], out var tenantId) && Guid.TryParse(parts[2], out var planId))
        {
            // Check if this subscription is already processed
            var existingSub = await _context.Subscriptions.FirstOrDefaultAsync(s => s.PaymentProviderSubscriptionId == cashfreeSubscriptionId);
            if (existingSub != null)
            {
                // Optionally update status if it changed, but for now just return
                _logger.LogInformation("Subscription {SubId} already exists, ignoring duplicate webhook.", cashfreeSubscriptionId);
                return;
            }

            var newSub = new SubscriptionManager.Domain.Entities.Subscription
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                PlanId = planId,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(1),
                Status = SubscriptionStatus.Active,
                PaymentProviderSubscriptionId = cashfreeSubscriptionId
            };
            _context.Subscriptions.Add(newSub);
            await _context.SaveChangesAsync(default);

            var plan = await _context.Plans.Include(p => p.Application).FirstOrDefaultAsync(p => p.Id == planId);
            if (plan?.Application != null && !string.IsNullOrEmpty(plan.Application.WebsiteUrl))
            {
                _ = _webhookService.NotifySubscriptionCreatedAsync(plan.Application.WebsiteUrl, tenantId, plan.Id, plan.Application.AppKey);
            }
            _logger.LogInformation("Successfully provisioned subscription for Tenant {TenantId} on Plan {PlanId}", tenantId, planId);
        }
    }
}
