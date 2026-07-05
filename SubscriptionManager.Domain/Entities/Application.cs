namespace SubscriptionManager.Domain.Entities;

public class Application
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string AppKey { get; set; } = Guid.NewGuid().ToString("N");
    public string WebhookUrl { get; set; } = string.Empty;
    
    // Marketing fields for Website Builder Integration
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public string? Badge { get; set; }
    public bool IsReady { get; set; } = true;
    
    // Navigation properties
    public ICollection<Plan> Plans { get; set; } = new List<Plan>();
}
