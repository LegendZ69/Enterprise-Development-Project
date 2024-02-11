namespace Enterprise_Development_Project_Assignment.Models
{
    public class FeedbackFormDTO
    {
        public string Email { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Topic { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public string StaffRemark { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int UserId { get; set; }

        public UserBasicDTO? User { get; set; }
    }
}
