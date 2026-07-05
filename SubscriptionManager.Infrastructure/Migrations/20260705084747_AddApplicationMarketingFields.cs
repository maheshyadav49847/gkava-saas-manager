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
                name: "Badge",
                table: "Applications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Applications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Applications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Applications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsReady",
                table: "Applications",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Badge",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "IsReady",
                table: "Applications");
        }
    }
}
