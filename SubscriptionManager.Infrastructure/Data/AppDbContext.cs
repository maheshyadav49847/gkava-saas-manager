using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Domain.Entities;
using SubscriptionManager.Domain.Enums;

using SubscriptionManager.Application.Common.Interfaces;

namespace SubscriptionManager.Infrastructure.Data;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Domain.Entities.Application> Applications { get; set; } = null!;
    public DbSet<Plan> Plans { get; set; } = null!;
    public DbSet<PlanFeature> PlanFeatures { get; set; } = null!;
    public DbSet<Tenant> Tenants { get; set; } = null!;
    public DbSet<Subscription> Subscriptions { get; set; } = null!;
    public DbSet<AdminUser> AdminUsers { get; set; } = null!;
    public DbSet<Coupon> Coupons { get; set; } = null!;
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Domain.Entities.Application>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.AppKey).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.AppKey).IsUnique();
        });


        modelBuilder.Entity<Plan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.MonthlyPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.YearlyPrice).HasColumnType("decimal(18,2)");
            
            entity.HasOne(e => e.Application)
                .WithMany(a => a.Plans)
                .HasForeignKey(e => e.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PlanFeature>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FeatureName).IsRequired().HasMaxLength(100);
            
            entity.HasOne(e => e.Plan)
                .WithMany(p => p.Features)
                .HasForeignKey(e => e.PlanId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
        });

        modelBuilder.Entity<Coupon>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.DiscountType).HasConversion<string>();
            entity.Property(e => e.DiscountValue).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>(); // Store enum as string
            
            entity.HasOne(e => e.Tenant)
                .WithMany(t => t.Subscriptions)
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Plan)
                .WithMany()
                .HasForeignKey(e => e.PlanId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Coupon)
                .WithMany()
                .HasForeignKey(e => e.CouponId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Seed Admin User
        modelBuilder.Entity<AdminUser>().HasData(new AdminUser
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Email = "admin@antigravity.com",
            Name = "System Admin",
            PasswordHash = "$2a$11$z/bW8QS/Yv7SS2yran4T/eh.yL1aNQlK2cfqgaNZ8ha0OE6rkVl5K"
        });
    }
}
