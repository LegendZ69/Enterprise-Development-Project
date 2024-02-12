using System.ComponentModel.DataAnnotations.Schema;

namespace Enterprise_Development_Project_Assignment.Models
{
	public class UserDTO
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
        public string ImageFile { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;
        public string PasswordResetToken { get; set; } = string.Empty;
        public DateTime ResetTokenExpires { get; set; }

        public string Status { get; set; } = string.Empty;
        [Column(TypeName = "datetime")]
        public DateTime? Deactivefully { get; set; }
        public bool TwoFactorEnabled { get; set; }
    }
}
