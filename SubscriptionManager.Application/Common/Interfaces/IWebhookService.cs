using System;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Common.Interfaces;

public interface IWebhookService
{
    Task NotifySubscriptionCreatedAsync(string WebsiteUrl, SubscriptionManager.Domain.Entities.Tenant tenant, SubscriptionManager.Domain.Entities.Plan plan, SubscriptionManager.Domain.Entities.Subscription subscription, string applicationKey);
    Task<bool> SendWebhookAsync(string url, string secret, string payload);
    Task NotifySubscriptionStatusChangedAsync(string webhookUrl, string eventType, SubscriptionManager.Domain.Entities.Tenant tenant, SubscriptionManager.Domain.Entities.Subscription subscription, string applicationKey);
}
