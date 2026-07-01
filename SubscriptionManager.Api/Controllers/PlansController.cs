using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.Plans.Commands.CreatePlan;
using SubscriptionManager.Application.Features.Plans.Queries.GetPlans;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PlansController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PlansController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<PlanDto>>> GetPlans()
        {
            var plans = await _mediator.Send(new GetPlansQuery());
            return Ok(plans);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreatePlan([FromBody] CreatePlanCommand command)
        {
            var planId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetPlans), new { id = planId }, planId);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePlan(Guid id, [FromBody] SubscriptionManager.Application.Features.Plans.Commands.UpdatePlan.UpdatePlanCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch");

            var result = await _mediator.Send(command);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePlan(Guid id)
        {
            var result = await _mediator.Send(new SubscriptionManager.Application.Features.Plans.Commands.DeletePlan.DeletePlanCommand { Id = id });
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
