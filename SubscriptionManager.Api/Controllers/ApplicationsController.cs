using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.Applications.Commands.CreateApplication;
using SubscriptionManager.Application.Features.Applications.Queries.GetApplications;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ApplicationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<ApplicationDto>>> Get()
    {
        var applications = await _mediator.Send(new GetApplicationsQuery());
        return Ok(applications);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateApplicationCommand command)
    {
        var applicationId = await _mediator.Send(command);
        return CreatedAtAction(nameof(Get), new { id = applicationId }, applicationId);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] SubscriptionManager.Application.Features.Applications.Commands.UpdateApplication.UpdateApplicationCommand command)
    {
        if (id != command.Id)
            return BadRequest("ID mismatch");

        var result = await _mediator.Send(command);
        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new SubscriptionManager.Application.Features.Applications.Commands.DeleteApplication.DeleteApplicationCommand { Id = id });
        if (!result)
            return NotFound();

        return NoContent();
    }
}
