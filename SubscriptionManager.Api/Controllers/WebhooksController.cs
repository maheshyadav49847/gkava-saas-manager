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
public class WebhooksController : ControllerBase
{
    private readonly IAppDbContext _context;

    public WebhooksController(IAppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        // For admin dashboard, we could list all or just for a specific tenant
        // Since it's a global webhooks tab, we'll return all for now
        var webhooks = await _context.WebhookEndpoints
            .Include(w => w.Tenant)
            .OrderByDescending(w => w.CreatedAt)
            .Select(w => new {
                w.Id,
                w.TenantId,
                TenantName = w.Tenant.Name,
                w.Url,
                w.Secret,
                w.IsActive,
                w.CreatedAt
            })
            .ToListAsync();

        return Ok(webhooks);
    }

    public class CreateWebhookRequest
    {
        public Guid TenantId { get; set; }
        public string Url { get; set; } = string.Empty;
        public string? SecretKey { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWebhookRequest request)
    {
        var tenant = await _context.Tenants.FindAsync(request.TenantId);
        if (tenant == null) return BadRequest("Tenant not found");

        var endpoint = new WebhookEndpoint
        {
            Id = Guid.NewGuid(),
            TenantId = request.TenantId,
            Url = request.Url,
            Secret = string.IsNullOrWhiteSpace(request.SecretKey) 
                ? $"whsec_{Guid.NewGuid().ToString("N")}" 
                : request.SecretKey,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.WebhookEndpoints.Add(endpoint);
        await _context.SaveChangesAsync(default);

        return Ok(endpoint);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var endpoint = await _context.WebhookEndpoints.FindAsync(id);
        if (endpoint == null) return NotFound();

        _context.WebhookEndpoints.Remove(endpoint);
        await _context.SaveChangesAsync(default);
        return Ok();
    }
}
