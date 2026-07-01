using MediatR;
using System;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.Plans.Commands.UpdatePlan
{
    public class UpdatePlanCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public Guid ApplicationId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal MonthlyPrice { get; set; }
        public decimal YearlyPrice { get; set; }
        public bool IsPopular { get; set; }
        public List<string> Features { get; set; } = new List<string>();
    }
}
