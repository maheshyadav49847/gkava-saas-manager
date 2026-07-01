using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Coupons.Commands.DeleteCoupon
{
    public class DeleteCouponCommandHandler : IRequestHandler<DeleteCouponCommand, bool>
    {
        private readonly IAppDbContext _context;

        public DeleteCouponCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteCouponCommand request, CancellationToken cancellationToken)
        {
            var coupon = await _context.Coupons.FindAsync(new object[] { request.Id }, cancellationToken);
            if (coupon == null) return false;

            // Instead of hard delete, we just deactivate it (Industry grade soft-delete approach for coupons)
            coupon.IsActive = false;
            coupon.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
