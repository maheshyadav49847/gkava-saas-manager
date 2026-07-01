using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using SubscriptionManager.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Tenants.Commands.CreateTenant
{
    public class CreateTenantCommandHandler : IRequestHandler<CreateTenantCommand, Guid>
    {
        private readonly IAppDbContext _context;

        public CreateTenantCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(CreateTenantCommand request, CancellationToken cancellationToken)
        {
            var tenant = new Tenant
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone
            };

            var subscription = new Subscription
            {
                TenantId = tenant.Id,
                PlanId = request.PlanId,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(1), // Default 1 month
                Status = SubscriptionStatus.Active
            };

            if (!string.IsNullOrWhiteSpace(request.CouponCode))
            {
                var coupon = _context.Coupons.FirstOrDefault(c => c.Code == request.CouponCode.ToUpper());
                if (coupon == null)
                    throw new Exception("Invalid coupon code.");
                
                if (!coupon.IsActive)
                    throw new Exception("Coupon is no longer active.");
                
                if (coupon.ExpiryDate.HasValue && coupon.ExpiryDate.Value < DateTime.UtcNow)
                    throw new Exception("Coupon has expired.");
                    
                if (coupon.MaxUses.HasValue && coupon.CurrentUses >= coupon.MaxUses.Value)
                    throw new Exception("Coupon usage limit reached.");
                    
                subscription.CouponId = coupon.Id;
                coupon.CurrentUses++;
            }

            tenant.Subscriptions.Add(subscription);
            _context.Tenants.Add(tenant);
            
            await _context.SaveChangesAsync(cancellationToken);

            return tenant.Id;
        }
    }
}
