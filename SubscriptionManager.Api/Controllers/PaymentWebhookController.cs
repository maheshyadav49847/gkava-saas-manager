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

            string eventType = string.Empty;
            string subscriptionId = string.Empty;

            if (root.TryGetProperty("type", out var typeProp))
            {
                eventType = typeProp.GetString()?.ToUpperInvariant() ?? "";
                if (root.TryGetProperty("data", out var dataProp))
                {
                    if (dataProp.TryGetProperty("subscription_details", out var subProp) || dataProp.TryGetProperty("subscription", out subProp))
                    {
                        if (subProp.TryGetProperty("subscription_id", out var subIdProp))
                            subscriptionId = subIdProp.GetString() ?? "";
                    }
                }
            }
            else if (root.TryGetProperty("cf_event", out var cfEventProp))
            {
                eventType = cfEventProp.GetString()?.ToUpperInvariant() ?? "";
                if (root.TryGetProperty("cf_subscriptionId", out var cfSubIdProp))
                    subscriptionId = cfSubIdProp.GetString() ?? "";
                else if (root.TryGetProperty("subscription_id", out var subIdProp2))
                    subscriptionId = subIdProp2.GetString() ?? "";
            }
            
            _logger.LogInformation("Cashfree Webhook received. Event: {Event}, SubId: {SubId}", eventType, subscriptionId);

            if (eventType == "SUBSCRIPTION_NEW" || 
                eventType == "SUBSCRIPTION_PAYMENT_SUCCESS" || 
                eventType == "SUBSCRIPTION_STATUS_CHANGED" ||
                eventType == "SUBSCRIPTION_STATUS_CHANGE" ||
                eventType == "SUBSCRIPTION_AUTH_STATUS" ||
                eventType.Contains("SUCCESS"))
            {
                if (!string.IsNullOrEmpty(subscriptionId) && subscriptionId.StartsWith("sub_"))
                {
                    await HandleSubscriptionSuccessAsync(subscriptionId, root);
                }
                else 
                {
                    _logger.LogWarning("Webhook matched success criteria but invalid or missing subscriptionId.");
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

    private async Task HandleSubscriptionSuccessAsync(string cashfreeSubscriptionId, JsonElement root)
    {
        var parts = cashfreeSubscriptionId.Split('_');
        if (parts.Length >= 3 && Guid.TryParse(parts[1], out var tenantId) && Guid.TryParse(parts[2], out var planId))
        {
            string paymentMethod = "Gateway";
            string paymentDetails = "";
            
            // Extract Payment details from Cashfree payload
            try 
            {
                if (root.TryGetProperty("data", out var dataProp) && dataProp.TryGetProperty("payment_method", out var pmProp))
                {
                    if (pmProp.TryGetProperty("card", out var cardProp)) {
                        paymentMethod = "Card";
                        var network = cardProp.TryGetProperty("card_network", out var n) ? n.GetString() : "";
                        var last4 = cardProp.TryGetProperty("card_number", out var n4) ? n4.GetString() : "";
                        paymentDetails = $"{network} **** {last4}".Trim();
                    }
                    else if (pmProp.TryGetProperty("upi", out var upiProp)) {
                        paymentMethod = "UPI";
                        paymentDetails = upiProp.TryGetProperty("upi_id", out var id) ? id.GetString() : "";
                    }
                    else if (pmProp.TryGetProperty("netbanking", out var nbProp)) {
                        paymentMethod = "NetBanking";
                        paymentDetails = nbProp.TryGetProperty("bank_name", out var bn) ? bn.GetString() : "";
                    }
                }
            }
            catch { }

            var plan = await _context.Plans.Include(p => p.Application).FirstOrDefaultAsync(p => p.Id == planId);

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
                PaymentProviderSubscriptionId = cashfreeSubscriptionId,
                PaymentMethod = paymentMethod,
                PaymentDetails = paymentDetails
            };
            
            var invoice = new SubscriptionManager.Domain.Entities.Invoice 
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                Amount = plan?.MonthlyPrice ?? 0,
                Currency = "INR",
                Status = InvoiceStatus.Paid,
                InvoiceDate = DateTime.UtcNow,
                PaymentMethod = paymentMethod,
                PaymentDetails = paymentDetails
            };
            
            _context.Subscriptions.Add(newSub);
            _context.Invoices.Add(invoice);
            
            await _context.SaveChangesAsync(default);

            var tenant = await _context.Tenants.FirstOrDefaultAsync(t => t.Id == tenantId);
            
            if (plan?.Application != null && !string.IsNullOrEmpty(plan.Application.WebhookUrl) && tenant != null)
            {
                _ = _webhookService.NotifySubscriptionCreatedAsync(plan.Application.WebhookUrl, tenant, plan, newSub, plan.Application.AppKey);
            }
            else if (plan?.Application != null && !string.IsNullOrEmpty(plan.Application.WebsiteUrl) && tenant != null)
            {
                // Fallback for legacy compatibility
                _ = _webhookService.NotifySubscriptionCreatedAsync(plan.Application.WebsiteUrl, tenant, plan, newSub, plan.Application.AppKey);
            }
            _logger.LogInformation("Successfully provisioned subscription and invoice for Tenant {TenantId} on Plan {PlanId}", tenantId, planId);
        }
    }
}
