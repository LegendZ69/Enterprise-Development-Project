using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class FeedbackForm
    {
        public int Id { get; set; } //FormId

        //FK property
        public int UserId { get; set; }

        // Navigation property to represent the one-to-many relationship
        public User? User { get; set; }

        [Required, EmailAddress, MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string FirstName { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string Topic { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(200)]
        public string Message { get; set; } = string.Empty;

        [MaxLength(200)]
        public string StaffRemark { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
    }
}
