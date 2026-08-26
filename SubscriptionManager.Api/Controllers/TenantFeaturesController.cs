using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TenantFeaturesController : ControllerBase
{
    private readonly IAppDbContext _context;

    public TenantFeaturesController(IAppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{tenantId}")]
    public async Task<IActionResult> Get(Guid tenantId)
    {
        var overrides = await _context.TenantEntitlementOverrides
            .Where(o => o.TenantId == tenantId)
            .ToListAsync();

        return Ok(overrides);
    }

    public class SetFeatureOverrideRequest
    {
        public string FeatureKey { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public int? QuotaLimit { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }

    [HttpPost("{tenantId}")]
    public async Task<IActionResult> SetFeatureOverride(Guid tenantId, [FromBody] SetFeatureOverrideRequest request)
    {
        var tenant = await _context.Tenants.FindAsync(tenantId);
        if (tenant == null) return NotFound("Tenant not found");

        var existing = await _context.TenantEntitlementOverrides
            .FirstOrDefaultAsync(o => o.TenantId == tenantId && o.FeatureKey == request.FeatureKey);

        if (existing != null)
        {
            existing.IsEnabled = request.IsEnabled;
            existing.QuotaLimit = request.QuotaLimit;
            existing.ExpiryDate = request.ExpiryDate;
        }
        else
        {
            // For now, mocking the admin ID.
            var adminUser = await _context.AdminUsers.FirstOrDefaultAsync();
            if (adminUser == null) return BadRequest("No admin users available to create override");

            _context.TenantEntitlementOverrides.Add(new TenantEntitlementOverride
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                FeatureKey = request.FeatureKey,
                IsEnabled = request.IsEnabled,
                QuotaLimit = request.QuotaLimit,
                ExpiryDate = request.ExpiryDate,
                CreatedAt = DateTime.UtcNow,
                CreatedByAdminId = adminUser.Id
            });
        }

        await _context.SaveChangesAsync(default);
        return Ok();
    }
}
