using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Application.Features.Auth.Commands.Login;
using System.Threading.Tasks;

namespace SubscriptionManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginCommand command)
        {
            var response = await _mediator.Send(command);
            return Ok(response);
        }

        [HttpGet("create-admin")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateAdmin([FromServices] SubscriptionManager.Infrastructure.Data.AppDbContext context)
        {
            var hash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
            context.AdminUsers.Add(new SubscriptionManager.Domain.Entities.AdminUser
            {
                Id = Guid.NewGuid(),
                Email = "test@admin.com",
                Name = "Test Admin",
                PasswordHash = hash
            });
            await context.SaveChangesAsync();
            return Ok(new { Email = "test@admin.com", Password = "Admin@123" });
        }
    }
}
