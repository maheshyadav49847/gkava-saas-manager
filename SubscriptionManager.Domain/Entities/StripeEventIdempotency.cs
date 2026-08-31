using System;

namespace SubscriptionManager.Domain.Entities;

public class StripeEventIdempotency : SubscriptionManager.Domain.Common.BaseAuditableEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string EventId { get; set; } = string.Empty;
    public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;
}
