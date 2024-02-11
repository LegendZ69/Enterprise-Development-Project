namespace Enterprise_Development_Project_Assignment.Models
{
	public class CreditCardDTO
	{
		public int Id { get; set; }

		public string CardNumber { get; set; }
		public string FirstName { get; set; } = string.Empty;
		public string LastName { get; set; } = string.Empty;
		public string City { get; set; } = string.Empty;
		public string Address { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
		public int UserId { get; set; }
		public UserDTO? User { get; set; }


	}
}