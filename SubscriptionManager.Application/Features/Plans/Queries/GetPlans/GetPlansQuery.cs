using MediatR;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.Plans.Queries.GetPlans
{
    public class GetPlansQuery : IRequest<List<PlanDto>>
    {
    }
}
