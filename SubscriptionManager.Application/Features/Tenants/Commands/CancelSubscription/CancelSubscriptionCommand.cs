using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SubscriptionManager.Domain.Enums;

namespace SubscriptionManager.Application.Features.Tenants.Commands.CancelSubscription
{
    public class CancelSubscriptionCommand : IRequest<bool>
    {
        public Guid TenantId { get; set; }
    }

    public class CancelSubscriptionCommandHandler : IRequestHandler<CancelSubscriptionCommand, bool>
    {
        private readonly IAppDbContext _context;

        public CancelSubscriptionCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(CancelSubscriptionCommand request, CancellationToken cancellationToken)
        {
            var subscription = await _context.Subscriptions
                .Where(s => s.TenantId == request.TenantId && s.Status == SubscriptionStatus.Active)
                .FirstOrDefaultAsync(cancellationToken);

            if (subscription == null) return false;

            subscription.CancelAtPeriodEnd = true;
            // Optionally set status to cancelled immediately depending on business logic, 
            // but setting CancelAtPeriodEnd is the standard approach.
            subscription.Status = SubscriptionStatus.Cancelled; 

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
