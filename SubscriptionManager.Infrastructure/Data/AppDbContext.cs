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
    public DbSet<ApplicationModule> ApplicationModules { get; set; } = null!;
    public DbSet<PlatformSetting> PlatformSettings { get; set; } = null!;
    public DbSet<TeamMember> TeamMembers { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
    public DbSet<ApiKey> ApiKeys { get; set; } = null!;
    public DbSet<StripeEventIdempotency> StripeEventIdempotencies { get; set; } = null!;
    public DbSet<Invoice> Invoices { get; set; } = null!;
    public DbSet<InvoiceLineItem> InvoiceLineItems { get; set; } = null!;
    public DbSet<Ticket> Tickets { get; set; } = null!;
    public DbSet<TicketMessage> TicketMessages { get; set; } = null!;
    public DbSet<TenantEntitlementOverride> TenantEntitlementOverrides { get; set; } = null!;
    public DbSet<AppIntegrationConfig> AppIntegrationConfigs { get; set; } = null!;
    public DbSet<AppIntegrationHistory> AppIntegrationHistories { get; set; } = null!;
    public DbSet<ContactMessage> ContactMessages { get; set; } = null!;
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

        modelBuilder.Entity<ApplicationModule>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Icon).HasMaxLength(50);
            
            entity.HasOne(e => e.Application)
                .WithMany(a => a.Modules)
                .HasForeignKey(e => e.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
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
            entity.HasIndex(e => e.Email);
            entity.HasIndex(e => e.PaymentProviderCustomerId);
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
            entity.HasIndex(e => e.TenantId);
            entity.Property(e => e.SubscriptionKey).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.SubscriptionKey).IsUnique();
            
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

        // Phase 6 Entities Configurations
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasConversion<string>(); // Store enum as string
            entity.HasOne(e => e.Tenant)
                .WithMany() 
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<InvoiceLineItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TaxAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Invoice)
                .WithMany(i => i.LineItems)
                .HasForeignKey(e => e.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.Priority).HasConversion<string>();
            entity.Property(e => e.Category).HasConversion<string>();
            entity.HasOne(e => e.Tenant)
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TicketMessage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Ticket)
                .WithMany(t => t.Messages)
                .HasForeignKey(e => e.TicketId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TenantEntitlementOverride>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Tenant)
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.CreatedByAdmin)
                .WithMany()
                .HasForeignKey(e => e.CreatedByAdminId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        

        

        // Seed Admin User
        modelBuilder.Entity<AdminUser>().HasData(new AdminUser
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Email = "admin@antigravity.com",
            Name = "System Admin",
            PasswordHash = "$2a$11$z/bW8QS/Yv7SS2yran4T/eh.yL1aNQlK2cfqgaNZ8ha0OE6rkVl5K"
        });

        // Seed Default Platform Settings
        modelBuilder.Entity<PlatformSetting>().HasData(new PlatformSetting
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
            SupportEmail = "support@gkava.com",
            PrivacyEmail = "privacy@gkava.com",
            LegalEmail = "legal@gkava.com",
            ContactPhone = "+91 98765 43210",
            UpdatedAt = new DateTime(2023, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        modelBuilder.Entity<TeamMember>().HasData(
            new TeamMember
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "Mahesh Kumar",
                Role = "Founder & CEO",
                Bio = "Visionary engineer with a passion for simplifying complex SaaS workflows and building scalable platforms.",
                Initials = "MK",
                DisplayOrder = 1
            },
            new TeamMember
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Name = "Ananya Patel",
                Role = "Lead Engineer",
                Bio = "Full-stack architect who designs the APIs and infrastructure that power thousands of businesses daily.",
                Initials = "AP",
                DisplayOrder = 2
            },
            new TeamMember
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                Name = "Rohan Verma",
                Role = "Head of Product",
                Bio = "Product strategist focused on translating customer feedback into features that developers actually love.",
                Initials = "RV",
                DisplayOrder = 3
            }
        );
        modelBuilder.Entity<AppIntegrationConfig>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<AppIntegrationHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
        });
    }
}
