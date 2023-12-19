using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enterprise_Development_Project_Assignment.Migrations
{
    /// <inheritdoc />
    public partial class Update_CustomerSupport_Backend : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StaffRemark",
                table: "FeedbackForms",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StaffRemark",
                table: "FeedbackForms");
        }
    }
}
