using System;

namespace SubscriptionManager.Domain.Entities;

public class WebsiteConfig
{
    public Guid Id { get; set; }
    public string JsonData { get; set; } = string.Empty;
    public DateTime LastUpdated { get; set; }
}
