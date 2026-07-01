using MediatR;
using SubscriptionManager.Domain.Entities;

namespace SubscriptionManager.Application.Features.Applications.Commands.CreateApplication;

public class CreateApplicationCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
}
