using System;

namespace SubscriptionManager.Domain.Entities;

public class PlatformSetting : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SupportEmail { get; set; } = string.Empty;
    public string PrivacyEmail { get; set; } = string.Empty;
    public string LegalEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? CashfreeAppId { get; set; }
    public string? CashfreeSecretKey { get; set; }
    public string CashfreeEnvironment { get; set; } = "SANDBOX"; // SANDBOX or PRODUCTION
}
