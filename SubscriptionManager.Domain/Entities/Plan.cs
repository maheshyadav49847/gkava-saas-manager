namespace SubscriptionManager.Domain.Entities;

public class Plan
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ApplicationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public bool IsPopular { get; set; }
    
    // Navigation properties
    public Application Application { get; set; } = null!;
    public ICollection<PlanFeature> Features { get; set; } = new List<PlanFeature>();
}
