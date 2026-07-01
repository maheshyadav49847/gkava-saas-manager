using SubscriptionManager.Domain.Entities;

namespace SubscriptionManager.Domain.Entities;

// Adding Subscription.cs here because it needs the Enum which was just created
using SubscriptionManager.Domain.Enums;

public class Subscription
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public Guid PlanId { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public SubscriptionStatus Status { get; set; }
    
    public Guid? CouponId { get; set; }
    
    // Navigation properties
    public Tenant Tenant { get; set; } = null!;
    public Plan Plan { get; set; } = null!;
    public Coupon? Coupon { get; set; }
}
