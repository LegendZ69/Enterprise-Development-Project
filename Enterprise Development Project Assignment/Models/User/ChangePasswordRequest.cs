using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class ChangePasswordRequest
    {
        [MaxLength(100)]
        public string CurrentPassword { get; set; }
        [MaxLength(100)]
        public string NewPassword { get; set; }
    }
}
