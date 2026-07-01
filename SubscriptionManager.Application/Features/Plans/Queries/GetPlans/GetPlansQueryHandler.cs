using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.Plans.Queries.GetPlans
{
    public class GetPlansQueryHandler : IRequestHandler<GetPlansQuery, List<PlanDto>>
    {
        private readonly IAppDbContext _context;

        public GetPlansQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PlanDto>> Handle(GetPlansQuery request, CancellationToken cancellationToken)
        {
            var plans = await _context.Plans
                .Include(p => p.Features)
                .OrderBy(p => p.MonthlyPrice)
                .ToListAsync(cancellationToken);

            return plans.Select(p => new PlanDto
            {
                Id = p.Id,
                ApplicationId = p.ApplicationId,
                Name = p.Name,
                Description = p.Description,
                MonthlyPrice = p.MonthlyPrice,
                YearlyPrice = p.YearlyPrice,
                IsPopular = p.IsPopular,
                Features = p.Features.Select(f => f.FeatureName).ToArray()
            }).ToList();
        }
    }
}
