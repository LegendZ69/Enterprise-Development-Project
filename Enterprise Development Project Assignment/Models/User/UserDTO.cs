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
    }
}
