using SubscriptionManager.Domain.Entities;

namespace SubscriptionManager.Domain.Entities;

// Adding Subscription.cs here because it needs the Enum which was just created
using SubscriptionManager.Domain.Enums;

public class Subscription : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid PlanId { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public SubscriptionStatus Status { get; set; }
    
    public string SubscriptionKey { get; set; } = string.Empty;
    
    public bool CancelAtPeriodEnd { get; set; }
    public string? PaymentProviderSubscriptionId { get; set; } // Stripe Sub ID
    
    public string? PaymentMethod { get; set; } // UPI, Card, Netbanking
    public string? PaymentDetails { get; set; } // ****4242, or upi_id
    
    public Guid? CouponId { get; set; }
    
    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public Plan Plan { get; set; } = null!;
    public Coupon? Coupon { get; set; }
}
