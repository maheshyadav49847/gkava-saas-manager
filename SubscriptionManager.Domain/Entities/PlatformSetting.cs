using System;

namespace SubscriptionManager.Domain.Entities;

public class PlatformSetting : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SupportEmail { get; set; } = string.Empty;
    public string PrivacyEmail { get; set; } = string.Empty;
    public string LegalEmail { get; set; } = string.Empty;
    public string ContactPhoneCountryCode { get; set; } = "+91";
    public string ContactPhone { get; set; } = string.Empty;
    public string? CashfreeAppId { get; set; }
    public string? CashfreeSecretKey { get; set; }
    public string CashfreeEnvironment { get; set; } = "SANDBOX"; // SANDBOX or PRODUCTION
    
    public string CompanyName { get; set; } = "SAAS Platform Inc.";
    public string CompanyAddress { get; set; } = "123 Tech Park, Phase 1\nSan Francisco, CA 94107";
    public string? GstNumber { get; set; }
}
