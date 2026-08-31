using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.ContactMessages.Commands.SubmitContactMessage
{
    public class SubmitContactMessageCommandHandler : IRequestHandler<SubmitContactMessageCommand, Guid>
    {
        private readonly IAppDbContext _context;

        public SubmitContactMessageCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(SubmitContactMessageCommand request, CancellationToken cancellationToken)
        {
            var message = new ContactMessage
            {
                Name = request.Name,
                Email = request.Email,
                Subject = request.Subject,
                Message = request.Message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync(cancellationToken);

            return message.Id;
        }
    }
}