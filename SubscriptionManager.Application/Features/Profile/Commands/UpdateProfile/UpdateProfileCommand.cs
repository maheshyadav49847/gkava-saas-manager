using MediatR;
using SubscriptionManager.Application.Features.Auth.Commands.Login;

namespace SubscriptionManager.Application.Features.Profile.Commands.UpdateProfile
{
    public class UpdateProfileCommand : IRequest<AuthResponseDto>
    {
        public string AdminUserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
