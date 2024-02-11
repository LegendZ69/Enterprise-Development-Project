using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class Coupons
    {
        public int Id { get; set; }

        [Required, MinLength(1), MaxLength(25)]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Only allow numbers, and letters")]
        public string CouponName { get; set; } = string.Empty;


        [Range(1, 100, ErrorMessage = "Discount must be between 1 and 100")]
        public decimal Discount { get; set; }

        public int Usage { get; set; }

        public bool Valid { get; set; }

        [Required, MinLength(1), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z0-9\s]+$", ErrorMessage = "Only allow letters, numbers, and spaces.")]
        public string CouponStatus { get; set; } = string.Empty;


        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
	}
}
