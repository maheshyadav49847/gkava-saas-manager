using MediatR;
using System;

namespace SubscriptionManager.Application.Features.Tenants.Commands.CreateTenant
{
    public class CreateTenantCommand : IRequest<Guid>
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Guid PlanId { get; set; }
        public string? CouponCode { get; set; }
    }
}
