using System;
using System.Threading.Tasks;
using SubscriptionManager.Domain.Entities;

namespace SubscriptionManager.Application.Common.Interfaces;

public interface IPaymentService
{
    /// <summary>
    /// Creates a Checkout Session and returns the Session URL.
    /// </summary>
    Task<string> CreateCheckoutSessionAsync(Tenant tenant, Plan plan, string successUrl, string cancelUrl);
}
