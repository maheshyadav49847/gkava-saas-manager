using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;
using SubscriptionManager.Application.Common.Interfaces;
using SubscriptionManager.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SubscriptionManager.Infrastructure.Services;

public class StripePaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;

    public StripePaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
        StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
    }

    public async Task<string> CreateCheckoutSessionAsync(Tenant tenant, SubscriptionManager.Domain.Entities.Plan plan, string successUrl, string cancelUrl)
    {
        // 1. Get or create Customer
        var customerId = tenant.PaymentProviderCustomerId;
        if (string.IsNullOrEmpty(customerId))
        {
            var customerOptions = new CustomerCreateOptions
            {
                Email = tenant.Email,
                Name = tenant.Name,
                Metadata = new Dictionary<string, string>
                {
                    { "TenantId", tenant.Id.ToString() }
                }
            };
            var customerService = new CustomerService();
            var customer = await customerService.CreateAsync(customerOptions);
            customerId = customer.Id;
            
            // Note: Caller is responsible for updating Tenant in Db with this customerId
            tenant.PaymentProviderCustomerId = customerId;
        }

        // 2. Get or create Price in Stripe
        var priceId = plan.PaymentProviderPriceId;
        if (string.IsNullOrEmpty(priceId))
        {
            var productOptions = new ProductCreateOptions
            {
                Name = plan.Name,
                Description = plan.Description,
            };
            var productService = new ProductService();
            var product = await productService.CreateAsync(productOptions);

            var priceOptions = new PriceCreateOptions
            {
                UnitAmount = (long)(plan.MonthlyPrice * 100), // Stripe expects amounts in cents
                Currency = "usd", // Should make this configurable
                Recurring = new PriceRecurringOptions
                {
                    Interval = "month",
                },
                Product = product.Id,
            };
            var priceService = new PriceService();
            var price = await priceService.CreateAsync(priceOptions);
            priceId = price.Id;
            
            // Note: Caller is responsible for updating Plan in Db with this priceId
            plan.PaymentProviderPriceId = priceId;
        }

        // 3. Create Checkout Session
        var options = new SessionCreateOptions
        {
            Customer = customerId,
            PaymentMethodTypes = new List<string>
            {
                "card",
            },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Price = priceId,
                    Quantity = 1,
                },
            },
            Mode = "subscription",
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            Metadata = new Dictionary<string, string>
            {
                { "TenantId", tenant.Id.ToString() },
                { "PlanId", plan.Id.ToString() }
            },
            SubscriptionData = new SessionSubscriptionDataOptions
            {
                Metadata = new Dictionary<string, string>
                {
                    { "TenantId", tenant.Id.ToString() },
                    { "PlanId", plan.Id.ToString() }
                }
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        return session.Url;
    }
}
