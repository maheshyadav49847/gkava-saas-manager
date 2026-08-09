using MediatR;

namespace SubscriptionManager.Application.Features.PlatformSettings.Commands.UpdatePlatformSettings;

public class UpdatePlatformSettingsCommand : IRequest<bool>
{
    public string SupportEmail { get; set; } = string.Empty;
    public string PrivacyEmail { get; set; } = string.Empty;
    public string LegalEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
}
