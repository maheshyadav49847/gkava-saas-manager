using MediatR;
using SubscriptionManager.Domain.Entities;

namespace SubscriptionManager.Application.Features.Applications.Commands.CreateApplication;

public class CreateApplicationCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public string? Badge { get; set; }
    public bool IsReady { get; set; } = true;
}
