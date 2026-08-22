using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Domain.Entities;

namespace SubscriptionManager.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Domain.Entities.Application> Applications { get; }
    DbSet<Plan> Plans { get; }
    DbSet<PlanFeature> PlanFeatures { get; }
    DbSet<Tenant> Tenants { get; }
    DbSet<Subscription> Subscriptions { get; }
    DbSet<AdminUser> AdminUsers { get; }
    DbSet<Coupon> Coupons { get; }
    DbSet<ApplicationModule> ApplicationModules { get; }
    DbSet<PlatformSetting> PlatformSettings { get; }
    DbSet<TeamMember> TeamMembers { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<ApiKey> ApiKeys { get; }
    DbSet<StripeEventIdempotency> StripeEventIdempotencies { get; }
    
    // Phase 6 Entities
    DbSet<Invoice> Invoices { get; }
    DbSet<InvoiceLineItem> InvoiceLineItems { get; }
    DbSet<Ticket> Tickets { get; }
    DbSet<TicketMessage> TicketMessages { get; }
    DbSet<TenantEntitlementOverride> TenantEntitlementOverrides { get; }
    DbSet<WebhookEndpoint> WebhookEndpoints { get; }
    DbSet<WebhookDeliveryLog> WebhookDeliveryLogs { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
