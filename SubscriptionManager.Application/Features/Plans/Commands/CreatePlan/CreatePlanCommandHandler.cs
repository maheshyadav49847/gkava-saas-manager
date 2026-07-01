using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Plans.Commands.CreatePlan
{
    public class CreatePlanCommandHandler : IRequestHandler<CreatePlanCommand, Guid>
    {
        private readonly IAppDbContext _context;

        public CreatePlanCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(CreatePlanCommand request, CancellationToken cancellationToken)
        {
            var plan = new Plan
            {
                ApplicationId = request.ApplicationId,
                Name = request.Name,
                Description = request.Description,
                MonthlyPrice = request.MonthlyPrice,
                YearlyPrice = request.YearlyPrice,
                IsPopular = request.IsPopular,
                Features = request.Features.Select(f => new PlanFeature
                {
                    FeatureName = f
                }).ToList()
            };

            _context.Plans.Add(plan);
            await _context.SaveChangesAsync(cancellationToken);

            return plan.Id;
        }
    }
}
