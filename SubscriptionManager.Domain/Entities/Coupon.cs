using SubscriptionManager.Domain.Enums;

namespace SubscriptionManager.Domain.Entities;

public class Coupon : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string Code { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    public DiscountType DiscountType { get; set; }
    
    public decimal DiscountValue { get; set; }
    
    public DateTime? ExpiryDate { get; set; }
    
    public int? MaxUses { get; set; }
    
    public int CurrentUses { get; set; }
    
    public bool IsActive { get; set; } = true;
}
