using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsSensitiveColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Meta_AppId_IsSensitive",
                table: "AppIntegrationConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Meta_BaseUrl_IsSensitive",
                table: "AppIntegrationConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Meta_ConfigId_IsSensitive",
                table: "AppIntegrationConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Meta_SystemUserToken_IsSensitive",
                table: "AppIntegrationConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Telegram_BaseUrl_IsSensitive",
                table: "AppIntegrationConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Twilio_AccountSid_IsSensitive",
                table: "AppIntegrationConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Twilio_AuthToken_IsSensitive",
                table: "AppIntegrationConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Twilio_SmsFromNumber_IsSensitive",
                table: "AppIntegrationConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "WhatsApp_WebhookVerifyToken_IsSensitive",
                table: "AppIntegrationConfigs",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Meta_AppId_IsSensitive",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "Meta_BaseUrl_IsSensitive",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "Meta_ConfigId_IsSensitive",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "Meta_SystemUserToken_IsSensitive",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "Telegram_BaseUrl_IsSensitive",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "Twilio_AccountSid_IsSensitive",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "Twilio_AuthToken_IsSensitive",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "Twilio_SmsFromNumber_IsSensitive",
                table: "AppIntegrationConfigs");

            migrationBuilder.DropColumn(
                name: "WhatsApp_WebhookVerifyToken_IsSensitive",
                table: "AppIntegrationConfigs");
        }
    }
}
