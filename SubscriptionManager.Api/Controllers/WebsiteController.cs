using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using SubscriptionManager.Application.Features.Applications.Queries.GetApplications;
using SubscriptionManager.Application.Features.Plans.Queries.GetPlans;
using SubscriptionManager.Application.Features.PlatformSettings.Queries.GetPlatformSettings;
using SubscriptionManager.Application.Features.TeamMembers.Queries.GetTeamMembers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class WebsiteController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMemoryCache _cache;
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10); // Cache data for 10 minutes

    public WebsiteController(IMediator mediator, IMemoryCache cache)
    {
        _mediator = mediator;
        _cache = cache;
    }

    [HttpGet("applications")]
    public async Task<ActionResult<List<ApplicationDto>>> GetApplications()
    {
        var cacheKey = "Website_Applications";
        
        // Return from cache if available, otherwise fetch and cache
        if (!_cache.TryGetValue(cacheKey, out List<ApplicationDto>? applications))
        {
            applications = await _mediator.Send(new GetApplicationsQuery());
            
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(CacheDuration);
                
            _cache.Set(cacheKey, applications, cacheEntryOptions);
        }
        
        return Ok(applications);
    }

    [HttpGet("plans")]
    public async Task<ActionResult<List<PlanDto>>> GetPlans()
    {
        var cacheKey = "Website_Plans";
        
        // Return from cache if available, otherwise fetch and cache
        if (!_cache.TryGetValue(cacheKey, out List<PlanDto>? plans))
        {
            plans = await _mediator.Send(new GetPlansQuery());
            
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(CacheDuration);
                
            _cache.Set(cacheKey, plans, cacheEntryOptions);
        }
        
        return Ok(plans);
    }

    [HttpGet("contact-settings")]
    public async Task<ActionResult<PlatformSettingsDto>> GetContactSettings()
    {
        var cacheKey = "Website_ContactSettings";
        
        if (!_cache.TryGetValue(cacheKey, out PlatformSettingsDto? settings))
        {
            settings = await _mediator.Send(new GetPlatformSettingsQuery());
            
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(CacheDuration);
                
            _cache.Set(cacheKey, settings, cacheEntryOptions);
        }
        
        return Ok(settings);
    }

    [HttpGet("team-members")]
    public async Task<ActionResult<List<TeamMemberDto>>> GetTeamMembers()
    {
        var cacheKey = "Website_TeamMembers";
        
        if (!_cache.TryGetValue(cacheKey, out List<TeamMemberDto>? teamMembers))
        {
            teamMembers = await _mediator.Send(new GetTeamMembersQuery());
            
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(CacheDuration);
                
            _cache.Set(cacheKey, teamMembers, cacheEntryOptions);
        }
        
        return Ok(teamMembers);
    }
}
