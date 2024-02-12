using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class RatingsAndReviews
    {
        public int Id { get; set; }

        //FK properties
        public int UserId { get; set; }

        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; }

        public int? ActivityId { get; set; }

        public Activity? Activity { get; set; }

        public int? BookingId { get; set; }

        public Booking? Booking { get; set; }

        /*public RatingsAndReviewsBasicDTO? RatingsAndReviewsBasic { get; set; }*/

        /*[Column(TypeName = "datetime")]
        public DateTime BookingDate { get; set; }*/

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        // Regular expression to enforce name format
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string FirstName { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public int Rating { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string Review { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? ImageFile { get; set; }

        [MaxLength(200)]
        public string? StaffRemark { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
    }
}
