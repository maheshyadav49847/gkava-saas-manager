using MediatR;
using Microsoft.EntityFrameworkCore;
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
            if (await _context.Tenants.AnyAsync(t => t.Email.ToLower() == request.Email.ToLower(), cancellationToken))
            {
                throw new ArgumentException("A tenant with this email already exists.");
            }

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
                    throw new ArgumentException("Invalid coupon code.");
                
                if (!coupon.IsActive)
                    throw new ArgumentException("Coupon is no longer active.");
                
                if (coupon.ExpiryDate.HasValue && coupon.ExpiryDate.Value < DateTime.UtcNow)
                    throw new ArgumentException("Coupon has expired.");
                    
                if (coupon.MaxUses.HasValue && coupon.CurrentUses >= coupon.MaxUses.Value)
                    throw new ArgumentException("Coupon usage limit reached.");
                    
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
