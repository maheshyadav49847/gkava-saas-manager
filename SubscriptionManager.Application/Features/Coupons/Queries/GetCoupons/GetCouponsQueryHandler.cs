using MediatR;
using SubscriptionManager.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Features.Coupons.Queries.GetCoupons
{
    public class GetCouponsQueryHandler : IRequestHandler<GetCouponsQuery, List<CouponDto>>
    {
        private readonly IAppDbContext _context;

        public GetCouponsQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CouponDto>> Handle(GetCouponsQuery request, CancellationToken cancellationToken)
        {
            var coupons = await _context.Coupons
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CouponDto
                {
                    Id = c.Id,
                    Code = c.Code,
                    DiscountType = c.DiscountType.ToString(),
                    DiscountValue = c.DiscountValue,
                    ExpiryDate = c.ExpiryDate,
                    MaxUses = c.MaxUses,
                    CurrentUses = c.CurrentUses,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return coupons;
        }
    }
}
