namespace Enterprise_Development_Project_Assignment.Models
{
    public class SuggestionFormDTO
    {
        public int Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string ActivityName { get; set; } = string.Empty;

        public string ActivityType { get; set; } = string.Empty;

        public string ActivityDescription { get; set; } = string.Empty;

        public string ActivityReason { get; set; } = string.Empty;

        public string? StaffRemark { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int UserId { get; set; }

        public UserBasicDTO? User { get; set; }
    }
}
