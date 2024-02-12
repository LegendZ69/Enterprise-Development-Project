using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class UpdateSuggestionRequest
    {
        [EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [MinLength(3), MaxLength(50)]
        public string ActivityName { get; set; } = string.Empty;

        public string ActivityType { get; set; } = string.Empty;

        [MinLength(3), MaxLength(200)]
        public string ActivityDescription { get; set; } = string.Empty;

        [MinLength(3), MaxLength(50)]
        public string ActivityReason { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? StaffRemark { get; set; } = string.Empty;
    }
}
