namespace SubscriptionManager.Application.Features.Applications.Queries.GetApplications;

public class ApplicationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AppKey { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public string? Badge { get; set; }
    public bool IsReady { get; set; }
}
