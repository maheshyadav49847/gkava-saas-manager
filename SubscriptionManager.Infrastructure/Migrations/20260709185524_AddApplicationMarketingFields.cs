using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicationMarketingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Applications",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string[]>(
                name: "Features",
                table: "Applications",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string>(
                name: "ImageBase64",
                table: "Applications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Features",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "ImageBase64",
                table: "Applications");
        }
    }
}
