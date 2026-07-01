using System;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.Dashboard.Queries.GetDashboardStats
{
    public class DashboardStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public int ActiveSubscriptionsCount { get; set; }
        public int NewTenantsCount { get; set; }
        public List<RecentActivityDto> RecentActivities { get; set; } = new List<RecentActivityDto>();
    }

    public class RecentActivityDto
    {
        public Guid Id { get; set; }
        public string ActivityType { get; set; }
        public string Description { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
