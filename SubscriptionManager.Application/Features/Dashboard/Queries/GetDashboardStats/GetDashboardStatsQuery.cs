using MediatR;

namespace SubscriptionManager.Application.Features.Dashboard.Queries.GetDashboardStats
{
    public class GetDashboardStatsQuery : IRequest<DashboardStatsDto>
    {
    }
}
