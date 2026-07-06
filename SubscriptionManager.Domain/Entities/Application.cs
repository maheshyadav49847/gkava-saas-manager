namespace SubscriptionManager.Domain.Entities;

public class Application
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string AppKey { get; set; } = Guid.NewGuid().ToString("N");
    public string WebhookUrl { get; set; } = string.Empty;
    
    // Navigation properties
    public ICollection<Plan> Plans { get; set; } = new List<Plan>();
}
