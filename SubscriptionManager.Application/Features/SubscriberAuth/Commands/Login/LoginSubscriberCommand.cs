using MediatR;
using SubscriptionManager.Application.Features.Auth.Commands.Login;

namespace SubscriptionManager.Application.Features.SubscriberAuth.Commands.Login
{
    public class LoginSubscriberCommand : IRequest<AuthResponseDto>
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
