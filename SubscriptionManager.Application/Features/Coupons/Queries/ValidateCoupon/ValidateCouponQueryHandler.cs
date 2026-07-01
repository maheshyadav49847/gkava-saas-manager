using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Application.Features.Coupons.Queries.GetCoupons;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Coupons.Queries.ValidateCoupon
{
    public class ValidateCouponQueryHandler : IRequestHandler<ValidateCouponQuery, CouponDto>
    {
        private readonly IAppDbContext _context;

        public ValidateCouponQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<CouponDto> Handle(ValidateCouponQuery request, CancellationToken cancellationToken)
        {
            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code.ToLower() == request.Code.ToLower(), cancellationToken);

            if (coupon == null)
            {
                throw new Exception("Coupon not found.");
            }

            if (!coupon.IsActive)
            {
                throw new Exception("This coupon is no longer active.");
            }

            if (coupon.ExpiryDate.HasValue && coupon.ExpiryDate.Value < DateTime.UtcNow)
            {
                throw new Exception("This coupon has expired.");
            }

            if (coupon.MaxUses.HasValue && coupon.CurrentUses >= coupon.MaxUses.Value)
            {
                throw new Exception("This coupon has reached its maximum usage limit.");
            }

            return new CouponDto
            {
                Id = coupon.Id,
                Code = coupon.Code,
                DiscountType = coupon.DiscountType.ToString(),
                DiscountValue = coupon.DiscountValue,
                ExpiryDate = coupon.ExpiryDate,
                MaxUses = coupon.MaxUses,
                CurrentUses = coupon.CurrentUses,
                IsActive = coupon.IsActive,
                CreatedAt = coupon.CreatedAt,
                UpdatedAt = coupon.UpdatedAt
            };
        }
    }
}
