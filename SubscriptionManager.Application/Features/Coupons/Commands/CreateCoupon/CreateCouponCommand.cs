using MediatR;
using SubscriptionManager.Domain.Enums;
using System;

namespace SubscriptionManager.Application.Features.Coupons.Commands.CreateCoupon
{
    public class CreateCouponCommand : IRequest<Guid>
    {
        public string Code { get; set; } = string.Empty;
        public DiscountType DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? MaxUses { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
