using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Domain.Entities;
using SubscriptionManager.Infrastructure.Data;
using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Infrastructure.Services
{
    public class CashfreePaymentService : IPaymentService
    {
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _context;

        public CashfreePaymentService(HttpClient httpClient, AppDbContext context)
        {
            _httpClient = httpClient;
            _context = context;
        }

        public async Task<string> CreateCheckoutSessionAsync(Tenant tenant, Plan plan, string successUrl, string cancelUrl)
        {
            var settings = await _context.PlatformSettings.FirstOrDefaultAsync();
            if (settings == null || string.IsNullOrEmpty(settings.CashfreeAppId) || string.IsNullOrEmpty(settings.CashfreeSecretKey))
            {
                throw new Exception("Cashfree Payment Gateway is not configured. Please provide AppId and SecretKey in Platform Settings.");
            }

            string baseUrl = settings.CashfreeEnvironment?.ToUpper() == "PRODUCTION" 
                ? "https://api.cashfree.com/pg" 
                : "https://sandbox.cashfree.com/pg";

            _httpClient.BaseAddress = new Uri(baseUrl);
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("x-client-id", settings.CashfreeAppId);
            _httpClient.DefaultRequestHeaders.Add("x-client-secret", settings.CashfreeSecretKey);
            _httpClient.DefaultRequestHeaders.Add("x-api-version", "2023-08-01");

            var cfPlanId = "plan_" + plan.Id.ToString("N").Substring(0, 20);

            // 1. Create or ensure plan exists
            var planResponse = await _httpClient.GetAsync($"/pg/plans/{cfPlanId}");
            if (!planResponse.IsSuccessStatusCode)
            {
                var planPayload = new
                {
                    plan_id = cfPlanId,
                    plan_name = string.IsNullOrEmpty(plan.Name) ? "SaaS Plan" : plan.Name,
                    plan_type = "PERIODIC",
                    plan_currency = "INR",
                    plan_recurring_amount = (double)plan.MonthlyPrice,
                    plan_max_amount = (double)(plan.MonthlyPrice * 5),
                    plan_intervals = 1,
                    plan_interval_type = "MONTH",
                    plan_max_cycles = 120
                };
                var planContent = new StringContent(JsonSerializer.Serialize(planPayload), Encoding.UTF8, "application/json");
                var createPlanRes = await _httpClient.PostAsync("/pg/plans", planContent);
                if (!createPlanRes.IsSuccessStatusCode)
                {
                    var err = await createPlanRes.Content.ReadAsStringAsync();
                    throw new Exception($"Cashfree plan creation failed: {err}");
                }
            }

            // 2. Create subscription
            var subscriptionId = "sub_" + tenant.Id.ToString("N") + "_" + plan.Id.ToString("N") + "_" + Guid.NewGuid().ToString("N").Substring(0, 4);
            
            var payload = new
            {
                subscription_id = subscriptionId,
                customer_details = new
                {
                    customer_name = string.IsNullOrEmpty(tenant.Name) ? "Customer" : tenant.Name,
                    customer_email = tenant.Email,
                    customer_phone = string.IsNullOrEmpty(tenant.Phone) ? "9999999999" : tenant.Phone
                },
                plan_details = new
                {
                    plan_id = cfPlanId
                },
                subscription_expiry_time = DateTime.UtcNow.AddYears(5).ToString("yyyy-MM-ddTHH:mm:ssZ"),
                subscription_meta = new
                {
                    return_url = successUrl
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("/pg/subscriptions", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Cashfree subscription creation failed: {responseContent}");
            }

            using var jsonDoc = JsonDocument.Parse(responseContent);
            if (jsonDoc.RootElement.TryGetProperty("subscription_session_id", out var sessionIdProp))
            {
                var sessionId = sessionIdProp.GetString();
                if (!string.IsNullOrEmpty(sessionId))
                {
                    return sessionId;
                }
            }

            throw new Exception("Could not retrieve subscription_session_id from Cashfree response. Response: " + responseContent);
        }
    }
}


