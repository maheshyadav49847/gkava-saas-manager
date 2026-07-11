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
            try
            {
                var response = await _mediator.Send(command);
                return Ok(response);
            }
            catch (System.UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
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

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            // For now, registering a user creates a new Tenant and assigns them a Subscription
            // based on the selected PlanId.
            var command = new SubscriptionManager.Application.Features.Tenants.Commands.CreateTenant.CreateTenantCommand
            {
                Name = string.IsNullOrEmpty(request.Name) ? request.Email : request.Name,
                Email = request.Email,
                Phone = request.Phone ?? "",
                PlanId = request.PlanId
            };

            try
            {
                var tenantId = await _mediator.Send(command);
                return Ok(new { Message = "Registration successful", TenantId = tenantId });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }

    public class RegisterRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Guid PlanId { get; set; }
        public Guid ApplicationId { get; set; } // Optional if not needed by CreateTenantCommand
    }
}
