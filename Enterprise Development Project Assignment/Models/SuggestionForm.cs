using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class SuggestionForm
    {
        //everytime after changing any of these properties, must add-migration [Name] and update-database
        public int Id { get; set; }

        [Required, MinLength(3), MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        public string ActivityName { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        public string ActivityType { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(200)]
        public string ActivityDescription { get; set; } = string.Empty;

        [Required, MinLength(3), MaxLength(50)]
        public string ActivityReason { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
    }
}
