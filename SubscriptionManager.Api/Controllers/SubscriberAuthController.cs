using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.Auth.Commands.Login;
using SubscriptionManager.Application.Features.SubscriberAuth.Commands.Login;
using SubscriptionManager.Application.Features.SubscriberAuth.Commands.Register;
using System;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class SubscriberAuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public SubscriberAuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<ActionResult<Guid>> Register([FromBody] RegisterSubscriberCommand command)
    {
        try
        {
            var tenantId = await _mediator.Send(command);
            return Ok(new { TenantId = tenantId });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginSubscriberCommand command)
    {
        try
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { error = "Invalid email or password." });
        }
    }
}
