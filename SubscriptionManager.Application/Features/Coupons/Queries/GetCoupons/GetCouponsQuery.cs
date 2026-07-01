using MediatR;
using SubscriptionManager.Application.Features.Coupons.Queries.GetCoupons;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.Coupons.Queries.GetCoupons
{
    public class GetCouponsQuery : IRequest<List<CouponDto>>
    {
    }
}
