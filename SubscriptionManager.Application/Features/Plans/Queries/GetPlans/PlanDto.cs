using System;

namespace SubscriptionManager.Application.Features.Plans.Queries.GetPlans
{
    public class PlanDto
    {
        public Guid Id { get; set; }
        public Guid ApplicationId { get; set; }
        public string ApplicationName { get; set; } = string.Empty;
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal MonthlyPrice { get; set; }
        public decimal YearlyPrice { get; set; }
        public string[] Features { get; set; }
        public bool IsPopular { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
