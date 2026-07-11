using MediatR;

namespace SubscriptionManager.Application.Features.Applications.Commands.UpdateApplication;

public class UpdateApplicationCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string WebhookUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageBase64 { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public List<UpdateApplicationModuleDto> Modules { get; set; } = new();
}

public class UpdateApplicationModuleDto
{
    public Guid? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}
