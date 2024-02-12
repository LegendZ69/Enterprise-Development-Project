using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class ResetPasswordRequest
    {
        [Required]
        public string Token {  get; set; } = string.Empty;
        [Required(ErrorMessage = "New Password is required")]
        [MinLength(12, ErrorMessage = "Password must be at least 12 characters long")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,}$", ErrorMessage = "Password must include lowercase, uppercase, number, and special character")]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "Confirm Password is required")]
        [Compare(nameof(NewPassword), ErrorMessage = "Password and confirmation password do not match")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}
