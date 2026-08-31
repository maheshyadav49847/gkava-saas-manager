using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSubscriptionKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SubscriptionKey",
                table: "Subscriptions",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            // Assign unique values to existing rows using their existing Id to avoid unique constraint violations
            migrationBuilder.Sql("UPDATE \"Subscriptions\" SET \"SubscriptionKey\" = 'sk_live_' || replace(\"Id\"::text, '-', '') WHERE \"SubscriptionKey\" = '';");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_SubscriptionKey",
                table: "Subscriptions",
                column: "SubscriptionKey",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Subscriptions_SubscriptionKey",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "SubscriptionKey",
                table: "Subscriptions");
        }
    }
}
