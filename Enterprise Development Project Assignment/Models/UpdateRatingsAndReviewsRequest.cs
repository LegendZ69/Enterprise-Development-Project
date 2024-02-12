using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class UpdateRatingsAndReviewsRequest
    {
        [EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string FirstName { get; set; } = string.Empty;

        [MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string LastName { get; set; } = string.Empty;

        public int Rating { get; set; }

        [MinLength(3), MaxLength(100)]
        public string Review { get; set; } = string.Empty;

        public int Like { get; set; }

        [MaxLength(20)]
        public string? ImageFile { get; set; }

        [MaxLength(200)]
        public string? StaffRemark { get; set; } = string.Empty;
    }
}
