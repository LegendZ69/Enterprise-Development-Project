using System.ComponentModel.DataAnnotations.Schema;

namespace Enterprise_Development_Project_Assignment.Models
{
	public class Payment
	{
		public int Id { get; set; }
		public decimal Price { get; set; }
		public string? ActivityTitle { get; set; }
		public string? BookedDate { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }
		public int UserId { get; set; }
		public User? User { get; set; }
	}
}
