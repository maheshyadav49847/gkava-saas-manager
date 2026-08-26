using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MoveWebhookToAppIntegration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WebhookUrl",
                table: "Applications");

            migrationBuilder.RenameColumn(
                name: "WebhookSecretEncrypted",
                table: "Applications",
                newName: "WebsiteUrl");

            migrationBuilder.AddColumn<string>(
                name: "TargetApiSecretEncrypted",
                table: "AppIntegrationConfigs",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TargetApiUrl",
                table: "AppIntegrationConfigs",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetApiSecretEncrypted",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "TargetApiUrl",
                table: "AppIntegrationConfigs");

            migrationBuilder.RenameColumn(
                name: "WebsiteUrl",
                table: "Applications",
                newName: "WebhookSecretEncrypted");

            migrationBuilder.AddColumn<string>(
                name: "WebhookUrl",
                table: "Applications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
