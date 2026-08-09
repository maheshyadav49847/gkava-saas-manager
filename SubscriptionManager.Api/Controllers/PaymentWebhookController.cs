using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using SubscriptionManager.Domain.Enums;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentWebhookController : ControllerBase
{
    private readonly string _webhookSecret;
    private readonly IAppDbContext _context;
    private readonly IWebhookService _webhookService;
    private readonly ILogger<PaymentWebhookController> _logger;

    public PaymentWebhookController(IConfiguration configuration, IAppDbContext context, IWebhookService webhookService, ILogger<PaymentWebhookController> logger)
    {
        _webhookSecret = configuration["Stripe:WebhookSecret"] ?? string.Empty;
        _context = context;
        _webhookService = webhookService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Index()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _webhookSecret
            );

            if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                if (session != null)
                {
                    await HandleCheckoutSessionCompletedAsync(session);
                }
            }

            return Ok();
        }
        catch (StripeException e)
        {
            _logger.LogError(e, "Stripe Webhook Error");
            return BadRequest();
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Internal Webhook Error");
            return StatusCode(500);
        }
    }

    private async Task HandleCheckoutSessionCompletedAsync(Stripe.Checkout.Session session)
    {
        // Get Tenant and Plan ID from metadata
        if (session.Metadata == null) return;
        
        var tenantIdStr = session.Metadata.GetValueOrDefault("TenantId");
        var planIdStr = session.Metadata.GetValueOrDefault("PlanId");
        var stripeSubscriptionId = session.SubscriptionId;

        if (Guid.TryParse(tenantIdStr, out var tenantId) && Guid.TryParse(planIdStr, out var planId))
        {
            // Activate the subscription in the database
            var newSub = new SubscriptionManager.Domain.Entities.Subscription
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                PlanId = planId,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(1), // Should ideally read from Stripe billing cycle
                Status = SubscriptionStatus.Active,
                PaymentProviderSubscriptionId = stripeSubscriptionId
            };

            _context.Subscriptions.Add(newSub);
            await _context.SaveChangesAsync(default);

            // Notify the external SaaS application
            var plan = await _context.Plans.Include(p => p.Application).FirstOrDefaultAsync(p => p.Id == planId);
            if (plan?.Application != null && !string.IsNullOrEmpty(plan.Application.WebhookUrl))
            {
                _ = _webhookService.NotifySubscriptionCreatedAsync(plan.Application.WebhookUrl, tenantId, plan.Id, plan.Application.AppKey);
            }
            
            _logger.LogInformation("Successfully provisioned subscription for Tenant {TenantId} on Plan {PlanId}", tenantId, planId);
        }
    }
}
