using MediatR;
using System;

namespace SubscriptionManager.Application.Features.Plans.Commands.DeletePlan
{
    public class DeletePlanCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}
