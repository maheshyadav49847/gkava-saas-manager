using MediatR;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Enums;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Dashboard.Queries.GetDashboardStats
{
    public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
    {
        private readonly IAppDbContext _context;

        public GetDashboardStatsQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
        {
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);

            var activeSubscriptions = await _context.Subscriptions
                .Include(s => s.Plan)
                .Where(s => s.Status == SubscriptionStatus.Active)
                .ToListAsync(cancellationToken);

            var totalRevenue = activeSubscriptions.Sum(s => s.Plan?.MonthlyPrice ?? 0);
            var activeSubscriptionsCount = activeSubscriptions.Count;

            var newTenantsCount = await _context.Tenants
                .Where(t => t.Subscriptions.Any(s => s.StartDate >= thirtyDaysAgo))
                .CountAsync(cancellationToken);

            // Fetch recent tenants as activity
            var recentTenants = await _context.Tenants
                .Include(t => t.Subscriptions)
                    .ThenInclude(s => s.Plan)
                .OrderByDescending(t => t.Id) // Usually better to have a CreatedAt, using Id assuming sequential or fallback to subscription start
                .Take(5)
                .ToListAsync(cancellationToken);

            var recentActivities = recentTenants.Select(t => 
            {
                var sub = t.Subscriptions.OrderByDescending(s => s.StartDate).FirstOrDefault();
                return new RecentActivityDto
                {
                    Id = t.Id,
                    ActivityType = "TenantSubscribed",
                    Description = $"{t.Name} subscribed to {sub?.Plan?.Name ?? "a plan"}",
                    Timestamp = sub?.StartDate ?? DateTime.UtcNow
                };
            })
            .OrderByDescending(a => a.Timestamp)
            .ToList();

            return new DashboardStatsDto
            {
                TotalRevenue = totalRevenue,
                ActiveSubscriptionsCount = activeSubscriptionsCount,
                NewTenantsCount = newTenantsCount,
                RecentActivities = recentActivities
            };
        }
    }
}
