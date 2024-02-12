using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class AddRatingsAndReviewsRequest
    {
        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
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
    }
}
