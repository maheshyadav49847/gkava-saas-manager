namespace SubscriptionManager.Domain.Entities;

public class Application
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string AppKey { get; set; } = Guid.NewGuid().ToString("N");
    public string WebhookUrl { get; set; } = string.Empty;
    
    // Marketing Fields
    public string Description { get; set; } = string.Empty;
    public string ImageBase64 { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public ICollection<ApplicationModule> Modules { get; set; } = new List<ApplicationModule>();
    
    // Navigation properties
    public ICollection<Plan> Plans { get; set; } = new List<Plan>();
}
