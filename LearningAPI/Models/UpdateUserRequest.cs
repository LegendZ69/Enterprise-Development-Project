using System.ComponentModel.DataAnnotations;
namespace LearningAPI.Models
{
    public class UpdateUserRequest
    {
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? ImageFile { get; set; }
    }
}
