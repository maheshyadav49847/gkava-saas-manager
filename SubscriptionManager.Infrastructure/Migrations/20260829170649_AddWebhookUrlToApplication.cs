using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWebhookUrlToApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WebhookUrl",
                table: "Applications",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WebhookUrl",
                table: "Applications");
        }
    }
}
