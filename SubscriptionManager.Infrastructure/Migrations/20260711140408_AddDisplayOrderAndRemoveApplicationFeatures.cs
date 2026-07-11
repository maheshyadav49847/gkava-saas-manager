using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDisplayOrderAndRemoveApplicationFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Features",
                table: "Applications");

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "Applications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "ApplicationModules",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "ApplicationModules");

            migrationBuilder.AddColumn<string[]>(
                name: "Features",
                table: "Applications",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);
        }
    }
}
