using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Infrastructure.Services;

public class WebhookService : IWebhookService
{
    private readonly HttpClient _httpClient;

    public WebhookService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task NotifySubscriptionCreatedAsync(string webhookUrl, Guid tenantId, Guid planId, string applicationKey)
    {
        if (string.IsNullOrWhiteSpace(webhookUrl))
        {
            // If the application doesn't have a webhook URL configured, we just skip it.
            return;
        }

        try
        {
            var payload = new
            {
                EventType = "subscription_created",
                TenantId = tenantId,
                PlanId = planId,
                ApplicationKey = applicationKey,
                Timestamp = DateTime.UtcNow
            };

            var jsonPayload = JsonSerializer.Serialize(payload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            // For enterprise resilience, we would add Polly retries here.
            // For now, we perform a basic POST request.
            var response = await _httpClient.PostAsync(webhookUrl, content);
            
            if (!response.IsSuccessStatusCode)
            {
                // In a real enterprise app, we'd log this and potentially add to a retry queue (e.g. RabbitMQ / Hangfire)
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
