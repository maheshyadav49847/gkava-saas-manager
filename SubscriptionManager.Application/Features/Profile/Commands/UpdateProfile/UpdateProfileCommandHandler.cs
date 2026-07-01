using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Application.Features.Auth.Commands.Login;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Profile.Commands.UpdateProfile
{
    public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, AuthResponseDto>
    {
        private readonly IAppDbContext _context;

        public UpdateProfileCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<AuthResponseDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(request.AdminUserId, out var userId))
            {
                throw new ArgumentException("Invalid user id");
            }

            var user = await _context.AdminUsers.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found");
            }

            user.Name = request.Name;
            user.Email = request.Email;

            await _context.SaveChangesAsync(cancellationToken);

            // Re-generate token since name/email might be in claims. We can just reuse LoginCommandHandler logic or simply return updated info.
            // Wait, for simplicity, we can just return the updated info and frontend will just update local state. The token will still be valid.
            // But if we want to return a new token, we can just new one. Let's return just Name/Email and the same token from the request.
            // Actually, we don't have the current token here, so let's just return a new AuthResponseDto with a dummy token or generate a new one.
            // A better way is to not return a new token and just return the user object, but for consistency we can return a new token.
            
            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes("ThisIsAMockSecretKeyForDevPurposeOnlyMakeItLongEnough!");
            
            var tokenDescriptor = new Microsoft.IdentityModel.Tokens.SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, user.Email),
                    new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, user.Name)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key), Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256Signature)
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
