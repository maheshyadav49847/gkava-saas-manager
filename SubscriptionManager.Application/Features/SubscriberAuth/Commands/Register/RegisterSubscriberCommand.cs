using MediatR;
using System;

namespace SubscriptionManager.Application.Features.SubscriberAuth.Commands.Register
{
    public class RegisterSubscriberCommand : IRequest<Guid>
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
