using MediatR;
using SubscriptionManager.Domain.Enums;
using System;

namespace SubscriptionManager.Application.Features.Coupons.Commands.UpdateCoupon
{
    public class UpdateCouponCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public DiscountType DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? MaxUses { get; set; }
        public bool IsActive { get; set; }
    }
}
