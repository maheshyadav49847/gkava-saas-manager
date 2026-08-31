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
                .Include(p => p.Application)
                .OrderBy(p => p.Application.Name)
                .ThenByDescending(p => p.CreatedAt)
                .ToListAsync(cancellationToken);

            return plans.Select(p => new PlanDto
            {
                Id = p.Id,
                ApplicationId = p.ApplicationId,
                ApplicationName = p.Application?.Name ?? "Unknown App",
                Name = p.Name,
                Description = p.Description,
                MonthlyPrice = p.MonthlyPrice,
                YearlyPrice = p.YearlyPrice,
                IsPopular = p.IsPopular,
                CreatedAt = p.CreatedAt,
                Features = p.Features.Select(f => f.FeatureName).ToArray()
            }).ToList();
        }
    }
}
