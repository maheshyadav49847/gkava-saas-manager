using System;
using System.Collections.Generic;

namespace SubscriptionManager.Application.Features.Tenants.Queries.GetTenantDetails
{
    public class TenantProfileDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneCountryCode { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? PaymentProviderCustomerId { get; set; }
        public bool IsSuspended { get; set; }
        public List<TenantSubscriptionDto> Subscriptions { get; set; } = new();
    }

    public class TenantSubscriptionDto
    {
        public Guid Id { get; set; }
        public string ApplicationName { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty;
        public decimal PlanPrice { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool CancelAtPeriodEnd { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PaymentDetails { get; set; }
    }
}
