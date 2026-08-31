using MediatR;
using System;

namespace SubscriptionManager.Application.Features.Tenants.Queries.GetTenantDetails
{
    public class GetTenantDetailsQuery : IRequest<TenantProfileDto?>
    {
        public Guid Id { get; set; }
    }
}
