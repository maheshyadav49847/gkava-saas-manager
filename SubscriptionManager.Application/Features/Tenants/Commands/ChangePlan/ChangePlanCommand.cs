using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using SubscriptionManager.Domain.Enums;

namespace SubscriptionManager.Application.Features.Tenants.Commands.ChangePlan
{
    public class ChangePlanCommand : IRequest<bool>
    {
        public Guid TenantId { get; set; }
        public Guid NewPlanId { get; set; }
    }

    public class ChangePlanCommandHandler : IRequestHandler<ChangePlanCommand, bool>
    {
        private readonly IAppDbContext _context;

        public ChangePlanCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(ChangePlanCommand request, CancellationToken cancellationToken)
        {
            var subscription = await _context.Subscriptions
                .Where(s => s.TenantId == request.TenantId && s.Status == SubscriptionStatus.Active)
                .FirstOrDefaultAsync(cancellationToken);

            if (subscription == null) return false;

            var newPlan = await _context.Plans.FindAsync(new object[] { request.NewPlanId }, cancellationToken);
            if (newPlan == null) return false;

            subscription.PlanId = request.NewPlanId;
            // Optionally update billing details based on new plan price, etc.
            
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
