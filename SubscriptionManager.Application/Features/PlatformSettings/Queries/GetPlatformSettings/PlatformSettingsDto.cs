using System;

namespace SubscriptionManager.Application.Features.PlatformSettings.Queries.GetPlatformSettings;

public class PlatformSettingsDto
{
    public Guid Id { get; set; }
    public string SupportEmail { get; set; } = string.Empty;
    public string PrivacyEmail { get; set; } = string.Empty;
    public string LegalEmail { get; set; } = string.Empty;
    public string ContactPhoneCountryCode { get; set; } = "+91";
    public string ContactPhone { get; set; } = string.Empty;
    public string? CashfreeAppId { get; set; }
    public string? CashfreeSecretKey { get; set; }
    public string CashfreeEnvironment { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyAddress { get; set; } = string.Empty;
    public string? GstNumber { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
