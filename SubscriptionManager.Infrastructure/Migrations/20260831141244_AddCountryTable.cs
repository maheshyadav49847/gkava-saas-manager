using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCountryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    PhoneCode = table.Column<string>(type: "text", nullable: false),
                    CurrencyCode = table.Column<string>(type: "text", nullable: false),
                    CurrencySymbol = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Countries",
                columns: new[] { "Id", "CurrencyCode", "CurrencySymbol", "Name", "PhoneCode" },
                values: new object[,]
                {
                    { "AE", "AED", "د.إ", "United Arab Emirates", "+971" },
                    { "AU", "AUD", "$", "Australia", "+61" },
                    { "CA", "CAD", "$", "Canada", "+1" },
                    { "DE", "EUR", "€", "Germany", "+49" },
                    { "FR", "EUR", "€", "France", "+33" },
                    { "IN", "INR", "₹", "India", "+91" },
                    { "JP", "JPY", "¥", "Japan", "+81" },
                    { "SG", "SGD", "$", "Singapore", "+65" },
                    { "UK", "GBP", "£", "United Kingdom", "+44" },
                    { "US", "USD", "$", "United States", "+1" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Countries");
        }
    }
}
