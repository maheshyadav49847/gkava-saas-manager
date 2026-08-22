using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Application.Features.Auth.Commands.Login;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.SubscriberAuth.Commands.Login
{
    public class LoginSubscriberCommandHandler : IRequestHandler<LoginSubscriberCommand, AuthResponseDto>
    {
        private readonly IAppDbContext _context;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;

        public LoginSubscriberCommandHandler(IAppDbContext context, Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> Handle(LoginSubscriberCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Tenants.FirstOrDefaultAsync(t => t.Email == request.Email, cancellationToken);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            // Read from configuration
            var jwtSecret = _configuration["JwtSettings:Secret"] ?? throw new InvalidOperationException("JwtSettings:Secret is missing");
            var expiryDays = double.TryParse(_configuration["JwtSettings:ExpiryDays"], out var days) ? days : 7;
            var key = Encoding.UTF8.GetBytes(jwtSecret);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, "Subscriber")
                }),
                Expires = DateTime.UtcNow.AddDays(expiryDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new AuthResponseDto
            {
                Token = tokenHandler.WriteToken(token),
                Name = user.Name,
                Email = user.Email
            };
        }
    }
}
