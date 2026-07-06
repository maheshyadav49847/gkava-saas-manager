namespace SubscriptionManager.Application.Features.Applications.Queries.GetApplications;

public class ApplicationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AppKey { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
}
