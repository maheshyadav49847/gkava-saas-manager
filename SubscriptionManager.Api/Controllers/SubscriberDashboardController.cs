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

    public SubscriberDashboardController(IAppDbContext context, IPaymentService paymentService, Microsoft.Extensions.Configuration.IConfiguration configuration)
    {
        _context = context;
        _paymentService = paymentService;
        _configuration = configuration;
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
                ApplicationKey = s.Plan.Application.AppKey,
                WebsiteUrl = s.Plan.Application.WebsiteUrl
            })
            .ToListAsync();

        var profile = await _context.Tenants
            .Where(t => t.Id == tenantId)
            .Select(t => new { t.Name, t.Email, t.Phone })
            .FirstOrDefaultAsync();

        return Ok(new
        {
            Profile = profile,
            Subscriptions = subscriptions
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

        // Basic validation: user can't have duplicate active subscriptions to the same plan
        var existingSub = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.PlanId == request.PlanId && s.Status == SubscriptionManager.Domain.Enums.SubscriptionStatus.Active);

        if (existingSub != null)
        {
            return BadRequest("You are already subscribed to this plan.");
        }

        // Get Frontend URL for redirects
        var frontendUrl = _configuration["FrontendUrl"]?.TrimEnd('/') ?? "http://localhost:5180";
        var websiteUrl = _configuration["WebsiteUrl"]?.TrimEnd('/') ?? "http://localhost:5170";
        
        var successUrl = $"{websiteUrl}/dashboard?success=true";
        var cancelUrl = $"{websiteUrl}/pricing?canceled=true";

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







