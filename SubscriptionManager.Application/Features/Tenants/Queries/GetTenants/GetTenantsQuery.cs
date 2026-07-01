using MediatR;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.Tenants.Queries.GetTenants
{
    public class GetTenantsQuery : IRequest<List<TenantDto>>
    {
    }
}
