namespace SubscriptionManager.Domain.Entities;

public class PlanFeature
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PlanId { get; set; }
    public string FeatureName { get; set; } = string.Empty;
    public string FeatureValue { get; set; } = string.Empty;
    
    // Navigation properties
    public Plan Plan { get; set; } = null!;
}
