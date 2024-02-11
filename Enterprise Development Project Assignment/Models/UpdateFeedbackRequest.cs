using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class UpdateFeedbackRequest
    {
        [EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string FirstName { get; set; } = string.Empty;

        [MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string LastName { get; set; } = string.Empty;

        public string Topic { get; set; } = string.Empty;

        [MinLength(3), MaxLength(200)]
        public string Message { get; set; } = string.Empty;

        [MaxLength(200)]
        public string StaffRemark { get; set; } = string.Empty;
    }
}
