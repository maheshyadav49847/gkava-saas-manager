using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class GlobalAuditAndPaymentTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Tickets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Tickets",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "TicketMessages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "TicketMessages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "TicketMessages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Tenants",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Tenants",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "TenantEntitlementOverrides",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "TenantEntitlementOverrides",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "TenantEntitlementOverrides",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "TeamMembers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "TeamMembers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "TeamMembers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "TeamMembers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Subscriptions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Subscriptions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentDetails",
                table: "Subscriptions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Subscriptions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Subscriptions",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Subscriptions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "StripeEventIdempotencies",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "StripeEventIdempotencies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "StripeEventIdempotencies",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "StripeEventIdempotencies",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "PlatformSettings",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "PlatformSettings",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "PlatformSettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "PlatformSettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Plans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Plans",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Plans",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Invoices",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentDetails",
                table: "Invoices",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Invoices",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Invoices",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Coupons",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Coupons",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "ContactMessages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "ContactMessages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "ContactMessages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Applications",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Applications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Applications",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Applications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "ApplicationModules",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "ApplicationModules",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "ApplicationModules",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "ApplicationModules",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "AppIntegrationHistories",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AppIntegrationHistories",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "AppIntegrationHistories",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AppIntegrationConfigs",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "AppIntegrationConfigs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "AppIntegrationConfigs",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "AppIntegrationConfigs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "ApiKeys",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "ApiKeys",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "ApiKeys",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "AdminUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "AdminUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "AdminUsers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "AdminUsers",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AdminUsers",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy" },
                values: new object[] { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null });

            migrationBuilder.UpdateData(
                table: "PlatformSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "CreatedBy", "UpdatedBy" },
                values: new object[] { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null });

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy" },
                values: new object[] { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null });

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy" },
                values: new object[] { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null });

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"),
                columns: new[] { "CreatedAt", "CreatedBy", "UpdatedAt", "UpdatedBy" },
                values: new object[] { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "TicketMessages");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "TicketMessages");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "TicketMessages");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Tenants");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Tenants");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Tenants");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Tenants");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "TenantEntitlementOverrides");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "TenantEntitlementOverrides");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "TenantEntitlementOverrides");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "TeamMembers");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "PaymentDetails",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "StripeEventIdempotencies");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "StripeEventIdempotencies");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "StripeEventIdempotencies");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "StripeEventIdempotencies");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "PlatformSettings");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "PlatformSettings");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "PlatformSettings");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "PaymentDetails",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "ContactMessages");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "ContactMessages");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "ContactMessages");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "ApplicationModules");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "ApplicationModules");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "ApplicationModules");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "ApplicationModules");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "AppIntegrationHistories");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "AppIntegrationHistories");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "ApiKeys");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "ApiKeys");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "ApiKeys");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "AdminUsers");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "AdminUsers");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "AdminUsers");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "AdminUsers");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "PlatformSettings",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "AppIntegrationHistories",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);
        }
    }
}
