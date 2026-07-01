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
            // Validate code uniqueness
            if (await _context.Coupons.AnyAsync(c => c.Code.ToLower() == request.Code.ToLower(), cancellationToken))
            {
                throw new Exception("A coupon with this code already exists.");
            }

            var coupon = new Coupon
            {
                Code = request.Code.ToUpper(),
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
