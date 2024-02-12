using Enterprise_Development_Project_Assignment.Models.Activi;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class Activity
    {
        public int Id { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string? Title { get; set; }

        [Required, MinLength(3), MaxLength(500)]
        public string? Description { get; set; }

        public decimal? Price { get; set; }

        [MaxLength(50)]
        public string? Category { get; set; }

        [MaxLength(20)]
        public string? ImageFile { get; set; }

        [Required]
        [Column(TypeName = "date")]
        public DateTime EventDate { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        // Foreign key property
        public int UserId { get; set; }

        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; }

        // Navigation property to represent the one-to-many relationship
        public List<Booking> Bookings { get; set; } = new List<Booking>();

        public virtual ICollection<Timeslot> Timeslots { get; set; }

        [JsonIgnore]
        public List<RatingsAndReviews>? RatingsAndReviews { get; set; }
    }
}
