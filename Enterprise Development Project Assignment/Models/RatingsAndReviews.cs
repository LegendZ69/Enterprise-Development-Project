using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class RatingsAndReviews
    {
        public int Id { get; set; }

        public int BookingId { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime BookingDate { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public int Rating { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string Opinion { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
    }
}
