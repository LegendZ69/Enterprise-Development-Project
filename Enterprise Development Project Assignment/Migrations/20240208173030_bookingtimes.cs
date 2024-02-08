using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enterprise_Development_Project_Assignment.Migrations
{
    /// <inheritdoc />
    public partial class bookingtimes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SelectedTimeSlot",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SelectedTimeSlot",
                table: "Bookings");
        }
    }
}
