using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.ContactMessages.Queries.GetContactMessages;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers;

[ApiController]
[Route("api/admin/contact-messages")]
[Authorize]
public class AdminContactMessagesController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminContactMessagesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<ContactMessageDto>>> Get()
    {
        var messages = await _mediator.Send(new GetContactMessagesQuery());
        return Ok(messages);
    }
}
