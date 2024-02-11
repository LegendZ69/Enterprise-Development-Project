using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
	public class AddCreditCardRequest
	{
		[Required]
		[StringLength(16, MinimumLength = 16, ErrorMessage = "Card number must be 16 digits.")]
		[RegularExpression("^[0-9]*$", ErrorMessage = "Card number must only be digits.")]
		public string CardNumber { get; set; }


		[Required]
		[RegularExpression("^[a-zA-Z ]*$", ErrorMessage = "First name can only contain letters.")]
		public string FirstName { get; set; }

		[Required]
		[RegularExpression("^[a-zA-Z ]*$", ErrorMessage = "Last name can only contain letters.")]
		public string LastName { get; set; }

		[Required]
		[RegularExpression("^[a-zA-Z ]*$", ErrorMessage = "City name can only contain letters.")]
		public string City { get; set; }

		[Required]
		[RegularExpression("^[a-zA-Z0-9 ]*$", ErrorMessage = "Address can only contain letters and numbers.")]
		public string Address { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }

	}
}
