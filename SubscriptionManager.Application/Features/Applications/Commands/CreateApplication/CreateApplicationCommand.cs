using MediatR;
using SubscriptionManager.Domain.Entities;

namespace SubscriptionManager.Application.Features.Applications.Commands.CreateApplication;

public class CreateApplicationCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageBase64 { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public List<CreateApplicationModuleDto> Modules { get; set; } = new();
}

public class CreateApplicationModuleDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
