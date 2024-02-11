using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enterprise_Development_Project_Assignment.Migrations
{
    /// <inheritdoc />
    public partial class forum2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Threads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Replies",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Threads");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Replies");
        }
    }
}
