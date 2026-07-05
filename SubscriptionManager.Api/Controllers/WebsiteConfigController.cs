using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.WebsiteConfig.Commands;
using SubscriptionManager.Application.Features.WebsiteConfig.Queries;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebsiteConfigController : ControllerBase
{
    private readonly IMediator _mediator;

    public WebsiteConfigController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetConfig()
    {
        var result = await _mediator.Send(new GetWebsiteConfigQuery());
        if (string.IsNullOrEmpty(result))
        {
            return Ok(null);
        }
        return Ok(result);
    }

    [HttpPost]
    [AllowAnonymous] // Changed temporarily to test saving
    public async Task<IActionResult> UpdateConfig([FromBody] UpdateConfigRequest request)
    {
        var result = await _mediator.Send(new UpdateWebsiteConfigCommand(request.JsonData));
        return Ok(new { message = result });
    }
}

public class UpdateConfigRequest
{
    public string JsonData { get; set; } = string.Empty;
}
