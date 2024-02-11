using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class UpdateUserRequest
    {
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [DataType(DataType.EmailAddress, ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; } = string.Empty;

        [RegularExpression(@"^\d{8}$", ErrorMessage = "Phone number must be 8 digits.")]
        public string PhoneNumber { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? ImageFile { get; set; }

        public string Status { get; set; } = string.Empty;

    }
}
