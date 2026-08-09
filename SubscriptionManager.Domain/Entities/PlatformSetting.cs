using System;

namespace SubscriptionManager.Domain.Entities;

public class PlatformSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SupportEmail { get; set; } = string.Empty;
    public string PrivacyEmail { get; set; } = string.Empty;
    public string LegalEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
