using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
	public class AddActivityRequests
	{
		[Required, MinLength(3), MaxLength(100)]
		public string Title { get; set; } = string.Empty;
		[Required, MinLength(3), MaxLength(500)]
		public string Description { get; set; } = string.Empty;
		[MaxLength(20)]
		public string? ImageFile { get; set; }
        public decimal? Price { get; set; } // Add Price property
        public string? Category { get; set; } // Add Category property
    }


}
