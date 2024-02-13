using System.ComponentModel.DataAnnotations.Schema;

namespace Enterprise_Development_Project_Assignment.Models
{
	public class AddPaymentRequest
	{
		public int Id { get; set; }
		public decimal Price { get; set; }
		public string? BookedDate { get; set; }
		public string? ActivityTitle { get; set; }
		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }
	}
}
