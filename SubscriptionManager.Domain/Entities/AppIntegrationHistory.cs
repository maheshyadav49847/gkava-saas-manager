using System;

namespace SubscriptionManager.Domain.Entities;

public class AppIntegrationHistory : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public string ConfigSnapshotJson { get; set; } = null!;
    public string? SyncStatus { get; set; }
}
