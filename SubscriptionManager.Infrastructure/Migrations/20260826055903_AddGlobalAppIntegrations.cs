using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGlobalAppIntegrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppIntegrationConfigs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TargetApiUrl = table.Column<string>(type: "text", nullable: false),
                    Meta_AppId = table.Column<string>(type: "text", nullable: true),
                    Meta_ConfigId = table.Column<string>(type: "text", nullable: true),
                    Meta_SystemUserToken = table.Column<string>(type: "text", nullable: true),
                    WhatsApp_WebhookVerifyToken = table.Column<string>(type: "text", nullable: true),
                    Meta_BaseUrl = table.Column<string>(type: "text", nullable: false),
                    Twilio_AccountSid = table.Column<string>(type: "text", nullable: true),
                    Twilio_AuthToken = table.Column<string>(type: "text", nullable: true),
                    Twilio_SmsFromNumber = table.Column<string>(type: "text", nullable: true),
                    Telegram_BaseUrl = table.Column<string>(type: "text", nullable: false),
                    LastUpdatedBy = table.Column<string>(type: "text", nullable: true),
                    LastUpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SyncStatus = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppIntegrationConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppIntegrationHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TargetApiUrl = table.Column<string>(type: "text", nullable: false),
                    ConfigSnapshotJson = table.Column<string>(type: "text", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SyncStatus = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppIntegrationHistories", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppIntegrationConfigs");

            migrationBuilder.DropTable(
                name: "AppIntegrationHistories");
        }
    }
}
