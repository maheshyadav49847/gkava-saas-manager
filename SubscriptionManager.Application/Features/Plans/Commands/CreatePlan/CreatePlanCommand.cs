using MediatR;
using System;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.Plans.Commands.CreatePlan
{
    public class CreatePlanCommand : IRequest<Guid>
    {
        public Guid ApplicationId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal MonthlyPrice { get; set; }
        public decimal YearlyPrice { get; set; }
        public bool IsPopular { get; set; }
        public List<string> Features { get; set; } = new List<string>();
    }
}
