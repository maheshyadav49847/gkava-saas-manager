using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Application.Features.Tenants.Commands.ResetPassword
{
    public class ResetPasswordCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, bool>
    {
        private readonly IAppDbContext _context;

        public ResetPasswordCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            var tenant = await _context.Tenants.FindAsync(new object[] { request.Id }, cancellationToken);
            if (tenant == null) return false;

            // In a real app, generate a token, save to DB, and send an email.
            // For now, we simulate success.
            await Task.Delay(500, cancellationToken); // Simulate email sending

            return true;
        }
    }
}
