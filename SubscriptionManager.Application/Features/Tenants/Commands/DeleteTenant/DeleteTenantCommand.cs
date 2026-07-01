using MediatR;
using System;

namespace SubscriptionManager.Application.Features.Tenants.Commands.DeleteTenant
{
    public class DeleteTenantCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}
