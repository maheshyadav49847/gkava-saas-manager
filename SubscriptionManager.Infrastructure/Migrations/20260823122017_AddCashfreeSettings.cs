using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCashfreeSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CashfreeAppId",
                table: "PlatformSettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CashfreeEnvironment",
                table: "PlatformSettings",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CashfreeSecretKey",
                table: "PlatformSettings",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "PlatformSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "CashfreeAppId", "CashfreeEnvironment", "CashfreeSecretKey" },
                values: new object[] { null, "SANDBOX", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CashfreeAppId",
                table: "PlatformSettings");

            migrationBuilder.DropColumn(
                name: "CashfreeEnvironment",
                table: "PlatformSettings");

            migrationBuilder.DropColumn(
                name: "CashfreeSecretKey",
                table: "PlatformSettings");
        }
    }
}
