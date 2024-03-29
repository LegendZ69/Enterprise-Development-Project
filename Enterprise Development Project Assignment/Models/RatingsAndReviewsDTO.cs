﻿namespace Enterprise_Development_Project_Assignment.Models
{
    public class RatingsAndReviewsDTO
    {
        public int Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public int Rating { get; set; }

        public string Review { get; set; } = string.Empty;

        public string? ImageFile { get; set; }

        public string? StaffRemark { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public int UserId { get; set; }

        public UserBasicDTO? User { get; set; }

        public int ActivityId { get; set; }

        public ActivityDTO? Activity { get; set; }

        public int BookingId { get; set; }

        public BookingDTO? Booking { get; set; }
    }
}
