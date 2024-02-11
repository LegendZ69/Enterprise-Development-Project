namespace Enterprise_Development_Project_Assignment.Models
{
    public class RatingsAndReviewsDTO
    {
        public string Email { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public int Rating { get; set; }

        public string Review { get; set; } = string.Empty;

        public int Like { get; set; }

        public string? ImageFile { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int UserId { get; set; }

        public UserBasicDTO? User { get; set; }

        /*public int ActivityId { get; set; }

        public ActivityBasicDTO? Activity { get; set; }*/
    }
}
