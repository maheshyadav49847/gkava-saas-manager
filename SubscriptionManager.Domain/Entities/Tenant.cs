namespace SubscriptionManager.Domain.Entities;

public class Tenant : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PaymentProviderCustomerId { get; set; } // e.g. Stripe Customer ID
    
    // Navigation properties
    public virtual ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
