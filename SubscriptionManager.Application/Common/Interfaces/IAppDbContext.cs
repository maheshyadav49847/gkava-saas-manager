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


    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
