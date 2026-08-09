using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.TeamMembers.Commands.CreateTeamMember;
using SubscriptionManager.Application.Features.TeamMembers.Commands.DeleteTeamMember;
using SubscriptionManager.Application.Features.TeamMembers.Commands.UpdateTeamMember;
using SubscriptionManager.Application.Features.TeamMembers.Queries.GetTeamMembers;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminTeamMembersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMemoryCache _cache;

    public AdminTeamMembersController(IMediator mediator, IMemoryCache cache)
    {
        _mediator = mediator;
        _cache = cache;
    }

    [HttpGet]
    public async Task<IActionResult> GetTeamMembers()
    {
        var result = await _mediator.Send(new GetTeamMembersQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTeamMember([FromBody] CreateTeamMemberCommand command)
    {
        var result = await _mediator.Send(command);
        _cache.Remove("Website_TeamMembers");
        return Ok(new { Id = result });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeamMember(Guid id, [FromBody] UpdateTeamMemberCommand command)
    {
        if (id != command.Id)
            return BadRequest("Id mismatch");

        var result = await _mediator.Send(command);
        
        if (!result)
            return NotFound();

        _cache.Remove("Website_TeamMembers");
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeamMember(Guid id)
    {
        var result = await _mediator.Send(new DeleteTeamMemberCommand { Id = id });

        if (!result)
            return NotFound();

        _cache.Remove("Website_TeamMembers");
        return NoContent();
    }
}
