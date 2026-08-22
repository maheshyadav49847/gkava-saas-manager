using System;

namespace SubscriptionManager.Domain.Entities;

public class WebhookDeliveryLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid WebhookEndpointId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string RequestPayload { get; set; } = string.Empty;
    public int? ResponseStatusCode { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime DeliveredAt { get; set; } = DateTime.UtcNow;
    public bool IsSuccessful { get; set; }

    public virtual WebhookEndpoint WebhookEndpoint { get; set; } = null!;
}
