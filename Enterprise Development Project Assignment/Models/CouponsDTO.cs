namespace Enterprise_Development_Project_Assignment.Models
{
	public class CouponsDTO
	{
		public int Id { get; set; }
		public string CouponName { get; set; } = string.Empty;
		public decimal Discount { get; set; }
		public int Usage { get; set; }
		public bool Valid { get; set; }
		public string CouponStatus { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }


	}
}