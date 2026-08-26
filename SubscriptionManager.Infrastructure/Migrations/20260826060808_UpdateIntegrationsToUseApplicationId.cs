using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIntegrationsToUseApplicationId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetApiUrl",
                table: "AppIntegrationHistories");

            migrationBuilder.DropColumn(
                name: "TargetApiUrl",
                table: "AppIntegrationConfigs");

            migrationBuilder.AddColumn<string>(
                name: "WebhookSecretEncrypted",
                table: "Applications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ApplicationId",
                table: "AppIntegrationHistories",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "ApplicationId",
                table: "AppIntegrationConfigs",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WebhookSecretEncrypted",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "ApplicationId",
                table: "AppIntegrationHistories");

            migrationBuilder.DropColumn(
                name: "ApplicationId",
                table: "AppIntegrationConfigs");

            migrationBuilder.AddColumn<string>(
                name: "TargetApiUrl",
                table: "AppIntegrationHistories",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TargetApiUrl",
                table: "AppIntegrationConfigs",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
