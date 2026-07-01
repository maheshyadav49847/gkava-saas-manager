using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Tenants.Queries.GetTenants
{
    public class GetTenantsQueryHandler : IRequestHandler<GetTenantsQuery, List<TenantDto>>
    {
        private readonly IAppDbContext _context;

        public GetTenantsQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TenantDto>> Handle(GetTenantsQuery request, CancellationToken cancellationToken)
        {
            var tenants = await _context.Tenants
                .Include(t => t.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .OrderBy(t => t.Name)
                .ToListAsync(cancellationToken);

            return tenants.Select(t =>
            {
                var activeSubscription = t.Subscriptions.OrderByDescending(s => s.StartDate).FirstOrDefault();
                
                return new TenantDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Email = t.Email,
                    Phone = t.Phone,
                    Plan = activeSubscription?.Plan?.Name ?? "No Plan",
                    Status = activeSubscription?.Status.ToString() ?? "Trialing",
                    JoinDate = activeSubscription?.StartDate ?? System.DateTime.UtcNow
                };
            }).ToList();
        }
    }
}
