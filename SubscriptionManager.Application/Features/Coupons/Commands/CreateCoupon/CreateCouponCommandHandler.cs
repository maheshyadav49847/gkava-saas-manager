using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Coupons.Commands.CreateCoupon
{
    public class CreateCouponCommandHandler : IRequestHandler<CreateCouponCommand, Guid>
    {
        private readonly IAppDbContext _context;

        public CreateCouponCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(CreateCouponCommand request, CancellationToken cancellationToken)
        {
            if (await _context.Coupons.AnyAsync(c => c.Code.ToLower() == request.Code.ToLower(), cancellationToken))
            {
                throw new ArgumentException("A coupon with this code already exists.");
            }

            if (request.ExpiryDate.HasValue && request.ExpiryDate.Value.ToUniversalTime() < DateTime.UtcNow)
            {
                throw new ArgumentException("Expiry date cannot be in the past.");
            }

            var coupon = new Coupon
            {
                Code = request.Code.ToUpper(),
                Description = request.Description,
                DiscountType = request.DiscountType,
                DiscountValue = request.DiscountValue,
                ExpiryDate = request.ExpiryDate?.ToUniversalTime(),
                MaxUses = request.MaxUses,
                IsActive = request.IsActive,
                CurrentUses = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync(cancellationToken);

            return coupon.Id;
        }
    }
}
