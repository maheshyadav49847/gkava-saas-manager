using MediatR;

namespace SubscriptionManager.Application.Features.Applications.Commands.UpdateApplication;

public class UpdateApplicationCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public string? Badge { get; set; }
    public bool IsReady { get; set; }
}
