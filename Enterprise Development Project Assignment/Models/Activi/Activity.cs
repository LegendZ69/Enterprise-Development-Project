using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Required, MaxLength(20)]
        public string? ImageFile { get; set; }

        [Column(TypeName = "date")]
        public DateTime EventDate { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        // Foreign key property
        public int UserId { get; set; }

        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; }

        // Navigation property to represent the one-to-many relationship
        public List<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
