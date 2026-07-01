using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace SubscriptionManager.Application.Features.Plans.Commands.UpdatePlan
{
    public class UpdatePlanCommandHandler : IRequestHandler<UpdatePlanCommand, bool>
    {
        private readonly IAppDbContext _context;

        public UpdatePlanCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdatePlanCommand request, CancellationToken cancellationToken)
        {
            var plan = await _context.Plans
                .Include(p => p.Features)
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
            
            if (plan == null)
                return false;

            plan.ApplicationId = request.ApplicationId;
            plan.Name = request.Name;
            plan.Description = request.Description;
            plan.MonthlyPrice = request.MonthlyPrice;
            plan.YearlyPrice = request.YearlyPrice;
            plan.IsPopular = request.IsPopular;

            // Synchronize Features
            var existingFeatures = plan.Features.ToList();
            var newFeatureNames = request.Features ?? new System.Collections.Generic.List<string>();

            // Remove features that are no longer requested
            var toRemove = existingFeatures.Where(f => !newFeatureNames.Contains(f.FeatureName)).ToList();
            foreach (var r in toRemove)
            {
                plan.Features.Remove(r);
                _context.PlanFeatures.Remove(r);
            }

            // Add features that are new
            var existingNames = existingFeatures.Select(f => f.FeatureName).ToList();
            var toAdd = newFeatureNames.Where(n => !existingNames.Contains(n)).ToList();
            foreach (var a in toAdd)
            {
                plan.Features.Add(new PlanFeature { FeatureName = a, FeatureValue = "Included" });
            }

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
