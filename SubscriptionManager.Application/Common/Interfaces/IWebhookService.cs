using System;
using System.Threading.Tasks;

namespace SubscriptionManager.Application.Common.Interfaces;

public interface IWebhookService
{
    Task NotifySubscriptionCreatedAsync(string WebsiteUrl, Guid tenantId, Guid planId, string applicationKey);
    Task<bool> SendWebhookAsync(string url, string secret, string payload);
}
