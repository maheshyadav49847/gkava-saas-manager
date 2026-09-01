using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Infrastructure.Services;

public class WebhookService : IWebhookService
{
    private readonly HttpClient _httpClient;

    public WebhookService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task NotifySubscriptionCreatedAsync(string webhookUrl, SubscriptionManager.Domain.Entities.Tenant tenant, SubscriptionManager.Domain.Entities.Plan plan, SubscriptionManager.Domain.Entities.Subscription subscription, string applicationKey)
    {
        if (string.IsNullOrWhiteSpace(webhookUrl))
        {
            return;
        }

        try
        {
            var payload = new
            {
                @event = "subscription_created",
                applicationKey = applicationKey,
                timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                data = new 
                {
                    tenant = new 
                    {
                        id = tenant.Id,
                        name = tenant.Name,
                        email = tenant.Email,
                        phone = tenant.Phone,
                        passwordHash = tenant.PasswordHash
                    },
                    subscription = new 
                    {
                        id = subscription.Id,
                        providerSubscriptionId = subscription.PaymentProviderSubscriptionId,
                        startDate = subscription.StartDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                        endDate = subscription.EndDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                        status = subscription.Status.ToString()
                    },
                    plan = new 
                    {
                        id = plan.Id,
                        name = plan.Name,
                        monthlyPrice = plan.MonthlyPrice,
                        yearlyPrice = plan.YearlyPrice
                    }
                }
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            // Optionally add secret header if available
            if (!string.IsNullOrWhiteSpace(applicationKey))
            {
                _httpClient.DefaultRequestHeaders.Remove("X-Signature");
                // basic generic signature or token
                _httpClient.DefaultRequestHeaders.Add("X-Signature", applicationKey);
            }

            var response = await _httpClient.PostAsync(webhookUrl, content);
            
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"[Webhook Warning] Failed to notify {webhookUrl}. Status: {response.StatusCode}");
            }
            else
            {
                Console.WriteLine($"[Webhook Success] Successfully notified {webhookUrl} of new subscription.");
            }
        }
        catch (Exception ex)
        {
            // Log the error but don't crash the subscription flow
            Console.WriteLine($"[Webhook Error] Error sending webhook to {webhookUrl}: {ex.Message}");
        }
    }


    public async Task NotifySubscriptionStatusChangedAsync(string webhookUrl, string eventType, SubscriptionManager.Domain.Entities.Tenant tenant, SubscriptionManager.Domain.Entities.Subscription subscription, string applicationKey)
    {
        if (string.IsNullOrWhiteSpace(webhookUrl))
        {
            return;
        }

        try
        {
            var payload = new
            {
                @event = eventType,
                applicationKey = applicationKey,
                timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                data = new 
                {
                    tenant = new 
                    {
                        id = tenant.Id,
                        name = tenant.Name,
                        email = tenant.Email,
                        isSuspended = tenant.IsSuspended
                    },
                    subscription = new 
                    {
                        id = subscription.Id,
                        status = subscription.Status.ToString()
                    }
                }
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            if (!string.IsNullOrWhiteSpace(applicationKey))
            {
                _httpClient.DefaultRequestHeaders.Remove("X-Signature");
                _httpClient.DefaultRequestHeaders.Add("X-Signature", applicationKey);
            }

            var response = await _httpClient.PostAsync(webhookUrl, content);
            
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"[Webhook Warning] Failed to notify {webhookUrl} of status change. Status: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Webhook Error] Error sending status change webhook to {webhookUrl}: {ex.Message}");
        }
    }

    public async Task<bool> SendWebhookAsync(string url, string secret, string payload)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Post, url);
            request.Content = new StringContent(payload, Encoding.UTF8, "application/json");

            if (!string.IsNullOrWhiteSpace(secret))
            {
                using var hmac = new System.Security.Cryptography.HMACSHA256(Encoding.UTF8.GetBytes(secret));
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                var signature = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                request.Headers.Add("X-Signature", signature);
            }

            var response = await _httpClient.SendAsync(request);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Webhook Error] Error sending webhook to {url}: {ex.Message}");
            return false;
        }
    }
}
