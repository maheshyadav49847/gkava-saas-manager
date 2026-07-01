using MediatR;
using SubscriptionManager.Application.Features.Coupons.Queries.GetCoupons;

namespace SubscriptionManager.Application.Features.Coupons.Queries.ValidateCoupon
{
    public class ValidateCouponQuery : IRequest<CouponDto>
    {
        public string Code { get; set; } = string.Empty;
    }
}
