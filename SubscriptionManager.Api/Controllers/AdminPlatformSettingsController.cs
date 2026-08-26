using MediatR;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.PlatformSettings.Queries.GetPlatformSettings;
using SubscriptionManager.Application.Features.PlatformSettings.Commands.UpdatePlatformSettings;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/admin/settings")]
public class AdminPlatformSettingsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMemoryCache _cache;

    public AdminPlatformSettingsController(IMediator mediator, IMemoryCache cache)
    {
        _mediator = mediator;
        _cache = cache;
    }

    [HttpGet]
    public async Task<ActionResult<PlatformSettingsDto>> GetSettings()
    {
        var settings = await _mediator.Send(new GetPlatformSettingsQuery());
        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdatePlatformSettingsCommand command)
    {
        var result = await _mediator.Send(command);
        if (result)
        {
            _cache.Remove("Website_ContactSettings");
            return Ok();
        }
        return BadRequest("Failed to update settings.");
    }
}
