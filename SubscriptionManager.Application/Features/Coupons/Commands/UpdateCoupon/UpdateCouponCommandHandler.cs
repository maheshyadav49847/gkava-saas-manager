using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Coupons.Commands.UpdateCoupon
{
    public class UpdateCouponCommandHandler : IRequestHandler<UpdateCouponCommand, bool>
    {
        private readonly IAppDbContext _context;

        public UpdateCouponCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateCouponCommand request, CancellationToken cancellationToken)
        {
            var coupon = await _context.Coupons.FindAsync(new object[] { request.Id }, cancellationToken);
            if (coupon == null) return false;

            // Check if another coupon has this code
            var exists = await _context.Coupons.AnyAsync(c => c.Code.ToLower() == request.Code.ToLower() && c.Id != request.Id, cancellationToken);
            if (exists)
            {
                throw new Exception("Another coupon with this code already exists.");
            }

            coupon.Code = request.Code.ToUpper();
            coupon.DiscountType = request.DiscountType;
            coupon.DiscountValue = request.DiscountValue;
            coupon.ExpiryDate = request.ExpiryDate?.ToUniversalTime();
            coupon.MaxUses = request.MaxUses;
            coupon.IsActive = request.IsActive;
            coupon.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
