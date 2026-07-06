using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SubscriptionManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class WebsiteRelationalSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JsonData",
                table: "WebsiteConfigs");

            migrationBuilder.CreateTable(
                name: "AboutCtas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Subtitle = table.Column<string>(type: "text", nullable: true),
                    ButtonText = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutCtas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutCtas_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AboutHeroes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tagline = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    TitleHighlight = table.Column<string>(type: "text", nullable: true),
                    Subtitle = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutHeroes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutHeroes_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AboutMissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Desc = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutMissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutMissions_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AboutValues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    SectionTitle = table.Column<string>(type: "text", nullable: true),
                    ItemId = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Desc = table.Column<string>(type: "text", nullable: true),
                    Icon = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutValues_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AboutVisions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Desc = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutVisions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutVisions_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookDemoFaqs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Question = table.Column<string>(type: "text", nullable: true),
                    Answer = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookDemoFaqs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookDemoFaqs_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookDemoHeroes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Subtitle = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookDemoHeroes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookDemoHeroes_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LandingEcosystems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tagline = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Subtitle = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandingEcosystems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LandingEcosystems_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LandingEngineerings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tagline = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Subtitle = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandingEngineerings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LandingEngineerings_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LandingFeatures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    FeatureTitle = table.Column<string>(type: "text", nullable: true),
                    FeatureSubtitle = table.Column<string>(type: "text", nullable: true),
                    ItemId = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Desc = table.Column<string>(type: "text", nullable: true),
                    Icon = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandingFeatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LandingFeatures_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LandingFinalCtas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Subtitle = table.Column<string>(type: "text", nullable: true),
                    ButtonText = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandingFinalCtas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LandingFinalCtas_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LandingHeroes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tagline = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    TitleHighlight = table.Column<string>(type: "text", nullable: true),
                    Subtitle = table.Column<string>(type: "text", nullable: true),
                    PrimaryCtaText = table.Column<string>(type: "text", nullable: true),
                    SecondaryCtaText = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandingHeroes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LandingHeroes_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LegalPrivacyPolicies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    LastUpdated = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LegalPrivacyPolicies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LegalPrivacyPolicies_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LegalTermsOfServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    LastUpdated = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LegalTermsOfServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LegalTermsOfServices_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductCustomSolutions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Desc = table.Column<string>(type: "text", nullable: true),
                    ButtonText = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductCustomSolutions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductCustomSolutions_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductHeaders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tagline = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    TitleHighlight = table.Column<string>(type: "text", nullable: true),
                    Subtitle = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductHeaders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductHeaders_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebsiteConfigId = table.Column<Guid>(type: "uuid", nullable: false),
                    ItemId = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Desc = table.Column<string>(type: "text", nullable: true),
                    Badge = table.Column<string>(type: "text", nullable: true),
                    IsReady = table.Column<bool>(type: "boolean", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    ApplicationId = table.Column<string>(type: "text", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductItems_WebsiteConfigs_WebsiteConfigId",
                        column: x => x.WebsiteConfigId,
                        principalTable: "WebsiteConfigs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LegalSections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PrivacyPolicyId = table.Column<Guid>(type: "uuid", nullable: true),
                    TermsOfServiceId = table.Column<Guid>(type: "uuid", nullable: true),
                    SectionId = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LegalSections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LegalSections_LegalPrivacyPolicies_PrivacyPolicyId",
                        column: x => x.PrivacyPolicyId,
                        principalTable: "LegalPrivacyPolicies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LegalSections_LegalTermsOfServices_TermsOfServiceId",
                        column: x => x.TermsOfServiceId,
                        principalTable: "LegalTermsOfServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductModules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    ModuleId = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Desc = table.Column<string>(type: "text", nullable: true),
                    Icon = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductModules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductModules_ProductItems_ProductItemId",
                        column: x => x.ProductItemId,
                        principalTable: "ProductItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductModuleBullets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductModuleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductModuleBullets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductModuleBullets_ProductModules_ProductModuleId",
                        column: x => x.ProductModuleId,
                        principalTable: "ProductModules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AboutCtas_WebsiteConfigId",
                table: "AboutCtas",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AboutHeroes_WebsiteConfigId",
                table: "AboutHeroes",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AboutMissions_WebsiteConfigId",
                table: "AboutMissions",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AboutValues_WebsiteConfigId",
                table: "AboutValues",
                column: "WebsiteConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_AboutVisions_WebsiteConfigId",
                table: "AboutVisions",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BookDemoFaqs_WebsiteConfigId",
                table: "BookDemoFaqs",
                column: "WebsiteConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_BookDemoHeroes_WebsiteConfigId",
                table: "BookDemoHeroes",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LandingEcosystems_WebsiteConfigId",
                table: "LandingEcosystems",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LandingEngineerings_WebsiteConfigId",
                table: "LandingEngineerings",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LandingFeatures_WebsiteConfigId",
                table: "LandingFeatures",
                column: "WebsiteConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_LandingFinalCtas_WebsiteConfigId",
                table: "LandingFinalCtas",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LandingHeroes_WebsiteConfigId",
                table: "LandingHeroes",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LegalPrivacyPolicies_WebsiteConfigId",
                table: "LegalPrivacyPolicies",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LegalSections_PrivacyPolicyId",
                table: "LegalSections",
                column: "PrivacyPolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_LegalSections_TermsOfServiceId",
                table: "LegalSections",
                column: "TermsOfServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_LegalTermsOfServices_WebsiteConfigId",
                table: "LegalTermsOfServices",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductCustomSolutions_WebsiteConfigId",
                table: "ProductCustomSolutions",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductHeaders_WebsiteConfigId",
                table: "ProductHeaders",
                column: "WebsiteConfigId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductItems_WebsiteConfigId",
                table: "ProductItems",
                column: "WebsiteConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductModuleBullets_ProductModuleId",
                table: "ProductModuleBullets",
                column: "ProductModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductModules_ProductItemId",
                table: "ProductModules",
                column: "ProductItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AboutCtas");

            migrationBuilder.DropTable(
                name: "AboutHeroes");

            migrationBuilder.DropTable(
                name: "AboutMissions");

            migrationBuilder.DropTable(
                name: "AboutValues");

            migrationBuilder.DropTable(
                name: "AboutVisions");

            migrationBuilder.DropTable(
                name: "BookDemoFaqs");

            migrationBuilder.DropTable(
                name: "BookDemoHeroes");

            migrationBuilder.DropTable(
                name: "LandingEcosystems");

            migrationBuilder.DropTable(
                name: "LandingEngineerings");

            migrationBuilder.DropTable(
                name: "LandingFeatures");

            migrationBuilder.DropTable(
                name: "LandingFinalCtas");

            migrationBuilder.DropTable(
                name: "LandingHeroes");

            migrationBuilder.DropTable(
                name: "LegalSections");

            migrationBuilder.DropTable(
                name: "ProductCustomSolutions");

            migrationBuilder.DropTable(
                name: "ProductHeaders");

            migrationBuilder.DropTable(
                name: "ProductModuleBullets");

            migrationBuilder.DropTable(
                name: "LegalPrivacyPolicies");

            migrationBuilder.DropTable(
                name: "LegalTermsOfServices");

            migrationBuilder.DropTable(
                name: "ProductModules");

            migrationBuilder.DropTable(
                name: "ProductItems");

            migrationBuilder.AddColumn<string>(
                name: "JsonData",
                table: "WebsiteConfigs",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
