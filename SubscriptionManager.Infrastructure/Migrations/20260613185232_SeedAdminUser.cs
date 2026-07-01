using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AdminUsers",
                columns: new[] { "Id", "Email", "Name", "PasswordHash" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "admin@antigravity.com", "System Admin", "$2a$11$z/bW8QS/Yv7SS2yran4T/eh.yL1aNQlK2cfqgaNZ8ha0OE6rkVl5K" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AdminUsers",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));
        }
    }
}
