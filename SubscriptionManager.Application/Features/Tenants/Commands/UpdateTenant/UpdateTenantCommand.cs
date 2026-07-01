using MediatR;
using System;

namespace SubscriptionManager.Application.Features.Tenants.Commands.UpdateTenant
{
    public class UpdateTenantCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
}
