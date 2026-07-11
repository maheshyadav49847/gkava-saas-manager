namespace SubscriptionManager.Application.Features.Applications.Queries.GetApplications;

public class ApplicationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string AppKey { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
    
    // Marketing Fields
    public string Description { get; set; } = string.Empty;
    public string ImageBase64 { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public List<ApplicationModuleDto> Modules { get; set; } = new();
}
