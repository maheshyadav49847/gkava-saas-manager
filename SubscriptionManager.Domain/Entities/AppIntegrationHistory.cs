using System;

namespace SubscriptionManager.Domain.Entities;

public class AppIntegrationHistory
{
    public Guid Id { get; set; }
    public Guid ApplicationId { get; set; }
    public string ConfigSnapshotJson { get; set; } = null!;
    public string? UpdatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? SyncStatus { get; set; }
}
