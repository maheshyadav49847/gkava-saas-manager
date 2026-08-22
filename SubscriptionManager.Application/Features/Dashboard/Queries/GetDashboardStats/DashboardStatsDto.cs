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
        public List<MrrHistoryDto> MrrHistory { get; set; } = new List<MrrHistoryDto>();
        public List<SubscriptionDistributionDto> SubscriptionDistribution { get; set; } = new List<SubscriptionDistributionDto>();
    }

    public class RecentActivityDto
    {
        public Guid Id { get; set; }
        public string ActivityType { get; set; }
        public string Description { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class MrrHistoryDto
    {
        public string Name { get; set; }
        public decimal Mrr { get; set; }
    }

    public class SubscriptionDistributionDto
    {
        public string Name { get; set; }
        public int Value { get; set; }
    }
}
