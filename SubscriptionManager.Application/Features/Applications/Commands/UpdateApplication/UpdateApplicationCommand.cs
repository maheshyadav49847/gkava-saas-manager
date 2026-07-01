using MediatR;

namespace SubscriptionManager.Application.Features.Applications.Commands.UpdateApplication;

public class UpdateApplicationCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
}
