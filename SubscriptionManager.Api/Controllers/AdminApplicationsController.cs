using MediatR;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.Applications.Commands.CreateApplication;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/admin/applications")]
public class AdminApplicationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminApplicationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> CreateApplication(CreateApplicationCommand command)
    {
        var applicationId = await _mediator.Send(command);
        return Ok(new { Id = applicationId });
    }
}
