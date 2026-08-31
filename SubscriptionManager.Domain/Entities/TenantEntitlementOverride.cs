using System;

namespace SubscriptionManager.Domain.Entities;

public class TenantEntitlementOverride : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TenantId { get; set; }
    public string FeatureKey { get; set; } = string.Empty;
    public bool IsEnabled { get; set; }
    public int? QuotaLimit { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public Guid CreatedByAdminId { get; set; }

    public virtual Tenant Tenant { get; set; } = null!;
    public virtual AdminUser CreatedByAdmin { get; set; } = null!;
}
