using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class FeedbackForm
    {
        public int Id { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required, MinLength(8), MaxLength(8)]
        public int ContactNo { get; set; }

        [Required]
        public string Topic { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(200)]
        public string Message { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
    }
}
