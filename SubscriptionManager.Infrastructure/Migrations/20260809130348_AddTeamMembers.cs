using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamMembers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "PlatformSettings",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    Bio = table.Column<string>(type: "text", nullable: false),
                    Initials = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "PlatformSettings",
                columns: new[] { "Id", "ContactPhone", "LegalEmail", "PrivacyEmail", "SupportEmail", "UpdatedAt" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000001"), "+91 98765 43210", "legal@gkava.com", "privacy@gkava.com", "support@gkava.com", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.InsertData(
                table: "TeamMembers",
                columns: new[] { "Id", "Bio", "DisplayOrder", "Initials", "Name", "Role" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), "Visionary engineer with a passion for simplifying complex SaaS workflows and building scalable platforms.", 1, "MK", "Mahesh Kumar", "Founder & CEO" },
                    { new Guid("00000000-0000-0000-0000-000000000002"), "Full-stack architect who designs the APIs and infrastructure that power thousands of businesses daily.", 2, "AP", "Ananya Patel", "Lead Engineer" },
                    { new Guid("00000000-0000-0000-0000-000000000003"), "Product strategist focused on translating customer feedback into features that developers actually love.", 3, "RV", "Rohan Verma", "Head of Product" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DeleteData(
                table: "PlatformSettings",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"));

            migrationBuilder.InsertData(
                table: "PlatformSettings",
                columns: new[] { "Id", "ContactPhone", "LegalEmail", "PrivacyEmail", "SupportEmail", "UpdatedAt" },
                values: new object[] { new Guid("22222222-2222-2222-2222-222222222222"), "+91 98765 43210", "legal@gkava.com", "privacy@gkava.com", "hello@gkava.com", new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });
        }
    }
}
