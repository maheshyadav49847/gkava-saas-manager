using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.Auth.Commands.Login;
using SubscriptionManager.Application.Features.Profile.Commands.UpdateProfile;
using SubscriptionManager.Application.Features.Profile.Commands.ChangePassword;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProfileController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut]
        public async Task<ActionResult<AuthResponseDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var command = new UpdateProfileCommand
            {
                AdminUserId = userId,
                Name = request.Name,
                Email = request.Email
            };

            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpPut("password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var command = new ChangePasswordCommand
            {
                AdminUserId = userId,
                CurrentPassword = request.CurrentPassword,
                NewPassword = request.NewPassword
            };

            await _mediator.Send(command);
            return NoContent();
        }
    }

    public class UpdateProfileRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
