using System;

namespace SubscriptionManager.Domain.Entities;

public class ApiKey : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Key { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
}
