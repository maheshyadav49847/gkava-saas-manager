using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.Tenants.Commands.CreateTenant;
using SubscriptionManager.Application.Features.Tenants.Queries.GetTenants;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TenantsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TenantsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<TenantDto>>> GetTenants()
        {
            var tenants = await _mediator.Send(new GetTenantsQuery());
            return Ok(tenants);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateTenant([FromBody] CreateTenantCommand command)
        {
            var tenantId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetTenants), new { id = tenantId }, tenantId);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateTenant(Guid id, [FromBody] SubscriptionManager.Application.Features.Tenants.Commands.UpdateTenant.UpdateTenantCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch");

            var result = await _mediator.Send(command);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTenant(Guid id)
        {
            var result = await _mediator.Send(new SubscriptionManager.Application.Features.Tenants.Commands.DeleteTenant.DeleteTenantCommand { Id = id });
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
