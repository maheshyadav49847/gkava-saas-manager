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
        var applications = await _mediator.Send(new GetApplicationsQuery());
        return Ok(applications);
    }

    [HttpGet("plans")]
    public async Task<ActionResult<List<PlanDto>>> GetPlans()
    {
        var plans = await _mediator.Send(new GetPlansQuery());
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

    [HttpPost("contact")]
    public async Task<ActionResult> SubmitContactMessage([FromBody] SubscriptionManager.Application.Features.ContactMessages.Commands.SubmitContactMessage.SubmitContactMessageCommand command)
    {
        await _mediator.Send(command);
        return Ok(new { message = "Your message has been sent successfully." });
    }
}
