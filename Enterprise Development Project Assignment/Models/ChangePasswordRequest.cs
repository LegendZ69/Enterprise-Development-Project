using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LearningAPI.Models
{
    public class ChangePasswordRequest
    {
        [MaxLength(100)]
        public string CurrentPassword { get; set; }
        [MaxLength(100)]
        public string NewPassword { get; set; }
    }
}
