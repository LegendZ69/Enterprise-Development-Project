using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enterprise_Development_Project_Assignment.Migrations
{
    /// <inheritdoc />
    public partial class p : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RatingsAndReviews_Bookings_BookingId",
                table: "RatingsAndReviews");

            migrationBuilder.AlterColumn<int>(
                name: "BookingId",
                table: "RatingsAndReviews",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ActivityId",
                table: "RatingsAndReviews",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_RatingsAndReviews_Bookings_BookingId",
                table: "RatingsAndReviews",
                column: "BookingId",
                principalTable: "Bookings",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RatingsAndReviews_Bookings_BookingId",
                table: "RatingsAndReviews");

            migrationBuilder.AlterColumn<int>(
                name: "BookingId",
                table: "RatingsAndReviews",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ActivityId",
                table: "RatingsAndReviews",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RatingsAndReviews_Bookings_BookingId",
                table: "RatingsAndReviews",
                column: "BookingId",
                principalTable: "Bookings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
