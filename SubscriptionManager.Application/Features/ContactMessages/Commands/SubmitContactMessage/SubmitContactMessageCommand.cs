using MediatR;
using System;

namespace SubscriptionManager.Application.Features.ContactMessages.Commands.SubmitContactMessage
{
    public class SubmitContactMessageCommand : IRequest<Guid>
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}