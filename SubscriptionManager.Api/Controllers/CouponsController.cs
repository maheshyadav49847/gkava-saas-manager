using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.Coupons.Commands.CreateCoupon;
using SubscriptionManager.Application.Features.Coupons.Commands.UpdateCoupon;
using SubscriptionManager.Application.Features.Coupons.Commands.DeleteCoupon;
using SubscriptionManager.Application.Features.Coupons.Queries.GetCoupons;
using SubscriptionManager.Application.Features.Coupons.Queries.ValidateCoupon;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CouponsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CouponsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<CouponDto>>> GetCoupons()
        {
            var coupons = await _mediator.Send(new GetCouponsQuery());
            return Ok(coupons);
        }

        [HttpGet("validate/{code}")]
        [AllowAnonymous] // Might need to be anonymous or accessible to non-admins
        public async Task<ActionResult<CouponDto>> ValidateCoupon(string code)
        {
            try
            {
                var coupon = await _mediator.Send(new ValidateCouponQuery { Code = code });
                return Ok(coupon);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateCoupon([FromBody] CreateCouponCommand command)
        {
            try
            {
                var id = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetCoupons), new { id }, id);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCoupon(Guid id, [FromBody] UpdateCouponCommand command)
        {
            if (id != command.Id)
                return BadRequest("ID mismatch");

            try
            {
                var result = await _mediator.Send(command);
                if (!result) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCoupon(Guid id)
        {
            var result = await _mediator.Send(new DeleteCouponCommand { Id = id });
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
