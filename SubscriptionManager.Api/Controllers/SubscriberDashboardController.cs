using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Subscriber")]
public class SubscriberDashboardController : ControllerBase
{
    private readonly IAppDbContext _context;
    private readonly IPaymentService _paymentService;
    private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
    private readonly IWebhookService _webhookService;

    public SubscriberDashboardController(IAppDbContext context, IPaymentService paymentService, Microsoft.Extensions.Configuration.IConfiguration configuration, IWebhookService webhookService)
    {
        _context = context;
        _paymentService = paymentService;
        _configuration = configuration;
        _webhookService = webhookService;
    }


    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var tenantIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(tenantIdString) || !Guid.TryParse(tenantIdString, out var tenantId))
        {
            return Unauthorized();
        }

        var subscriptions = await _context.Subscriptions
            .Include(s => s.Plan)
                .ThenInclude(p => p.Application)
            .Where(s => s.TenantId == tenantId)
            .Select(s => new
            {
                s.Id,
                Status = s.Status.ToString(),
                s.StartDate,
                s.EndDate,
                s.CancelAtPeriodEnd,
                PlanName = s.Plan.Name,
                ApplicationName = s.Plan.Application.Name,
                ApplicationKey = s.SubscriptionKey,
                WebsiteUrl = s.Plan.Application.WebsiteUrl
            })
            .ToListAsync();

        var profile = await _context.Tenants
            .Where(t => t.Id == tenantId)
            .Select(t => new { t.Name, t.Email, t.Phone })
            .FirstOrDefaultAsync();

        var invoices = await _context.Invoices
            .Where(i => i.TenantId == tenantId)
            .OrderByDescending(i => i.InvoiceDate)
            .Select(i => new {
                i.Id,
                i.InvoiceNumber,
                i.Amount,
                i.Currency,
                Status = i.Status.ToString(),
                i.InvoiceDate,
                i.PaymentMethod,
                i.PaymentDetails,
                LineItems = i.LineItems.Select(li => new {
                    li.Description,
                    li.Amount,
                    li.Quantity,
                    li.TaxAmount
                })
            })
            .ToListAsync();

        return Ok(new
        {
            Profile = profile,
            Subscriptions = subscriptions,
            Invoices = invoices
        });
    }

    public class SubscribeRequest
    {
        public Guid PlanId { get; set; }
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
    {
        var tenantIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(tenantIdString) || !Guid.TryParse(tenantIdString, out var tenantId))
        {
            return Unauthorized();
        }

        var tenant = await _context.Tenants.FindAsync(tenantId);
        if (tenant == null) return Unauthorized();

        var plan = await _context.Plans.FindAsync(request.PlanId);
        if (plan == null) return NotFound("Plan not found.");

        // Strict Industry Rule: 1 Base Plan per Application
        var existingSubsForApp = await _context.Subscriptions
            .Include(s => s.Plan)
            .Where(s => s.TenantId == tenantId && s.Plan.ApplicationId == plan.ApplicationId && s.Status == SubscriptionManager.Domain.Enums.SubscriptionStatus.Active)
            .ToListAsync();

        foreach (var existing in existingSubsForApp)
        {
            if (existing.PlanId == request.PlanId)
            {
                return BadRequest("You are already subscribed to this exact plan. To increase quantity, use the manage subscription panel.");
            }
            
            // This is an Upgrade/Downgrade flow.
            // In a real Cashfree proration, we would call Cashfree APIs to modify the subscription.
            // For now, we follow industry standard "Graceful Downgrade/Replace" by marking the old one as CancelAtPeriodEnd 
            // or immediately cancelling it. We will cancel it immediately to prevent overlapping entitlements.
            existing.Status = SubscriptionManager.Domain.Enums.SubscriptionStatus.Cancelled;
            existing.EndDate = DateTime.UtcNow; // Revoke immediately upon upgrade
        }

        // Get Frontend URL for redirects
        var frontendUrl = _configuration["FrontendUrl"]?.TrimEnd('/') ?? "http://localhost:5180";
        var websiteUrl = _configuration["WebsiteUrl"]?.TrimEnd('/') ?? "http://localhost:5170";
        
        var successUrl = $"{websiteUrl}/dashboard?success=true";
        var cancelUrl = $"{websiteUrl}/pricing?canceled=true";

        if (plan.MonthlyPrice == 0)
        {
            var newSub = new SubscriptionManager.Domain.Entities.Subscription
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                PlanId = request.PlanId,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddYears(1), // Let's give it 1 year by default for free plan
                Status = SubscriptionManager.Domain.Enums.SubscriptionStatus.Active,
                SubscriptionKey = "sk_live_" + Guid.NewGuid().ToString("N"),
                PaymentProviderSubscriptionId = "free_" + Guid.NewGuid().ToString("N"),
                PaymentMethod = "Free",
                PaymentDetails = "Free Plan"
            };
            
            var invoice = new SubscriptionManager.Domain.Entities.Invoice 
            {
                Id = Guid.NewGuid(),
                InvoiceNumber = await Helpers.InvoiceNumberGenerator.GenerateNextAsync(_context),
                TenantId = tenantId,
                Amount = 0,
                Currency = "INR",
                Status = SubscriptionManager.Domain.Enums.InvoiceStatus.Paid,
                InvoiceDate = DateTime.UtcNow,
                PaymentMethod = "Free",
                PaymentDetails = "Free Plan",
                LineItems = new List<SubscriptionManager.Domain.Entities.InvoiceLineItem>
                {
                    new SubscriptionManager.Domain.Entities.InvoiceLineItem
                    {
                        Id = Guid.NewGuid(),
                        Description = $"Subscription to {plan.Name}",
                        Amount = 0,
                        Quantity = 1,
                        TaxAmount = 0
                    }
                }
            };

            _context.Subscriptions.Add(newSub);
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync(default);

            var planWithApp = await _context.Plans.Include(p => p.Application).FirstOrDefaultAsync(p => p.Id == request.PlanId);
            if (planWithApp?.Application != null && !string.IsNullOrEmpty(planWithApp.Application.WebhookUrl) && tenant != null)
            {
                _ = _webhookService.NotifySubscriptionCreatedAsync(planWithApp.Application.WebhookUrl, tenant, planWithApp, newSub, newSub.SubscriptionKey);
            }

            return Ok(new { Url = successUrl, Environment = "Free" });
        }

        try
        {
            // Create Checkout Session via Payment Service
            var sessionUrl = await _paymentService.CreateCheckoutSessionAsync(tenant, plan, successUrl, cancelUrl);

            // Save any changes to Tenant (Customer ID) or Plan (Price ID) made by the Payment Service
            await _context.SaveChangesAsync(default);

            
            var settings = await _context.PlatformSettings.FirstOrDefaultAsync();
            var env = settings?.CashfreeEnvironment ?? "SANDBOX";
            return Ok(new { Url = sessionUrl, Environment = env });
        }
        catch (Exception ex) when (ex.Message.Contains("Cashfree Payment Gateway is not configured")) { return BadRequest(new { Message = ex.Message }); }
        catch (System.Exception ex) { return StatusCode(500, new { Message = "An unexpected error occurred during checkout setup. " + ex.Message }); }
    }

    [HttpPost("unsubscribe/{id}")]
    public async Task<IActionResult> Unsubscribe(Guid id)
    {
        var tenantIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(tenantIdString) || !Guid.TryParse(tenantIdString, out var tenantId))
        {
            return Unauthorized();
        }

        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.Id == id && s.TenantId == tenantId);

        if (subscription == null)
        {
            return NotFound("Subscription not found.");
        }

        if (subscription.Status == SubscriptionManager.Domain.Enums.SubscriptionStatus.Cancelled || subscription.CancelAtPeriodEnd)
        {
            return BadRequest("Subscription is already cancelled or pending cancellation.");
        }

        subscription.CancelAtPeriodEnd = true;
        // Keep status Active until EndDate is reached
        
        await _context.SaveChangesAsync(default);

        return Ok(new { Message = "Successfully unsubscribed from plan." });
    }
}







