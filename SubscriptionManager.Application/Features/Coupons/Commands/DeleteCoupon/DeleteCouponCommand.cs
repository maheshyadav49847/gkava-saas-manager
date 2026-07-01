using MediatR;
using System;

namespace SubscriptionManager.Application.Features.Coupons.Commands.DeleteCoupon
{
    public class DeleteCouponCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}
