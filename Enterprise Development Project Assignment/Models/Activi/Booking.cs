using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class Booking
    {
        public int Id { get; set; }

        [Column(TypeName = "datetime2")]
        [Required]
        [FutureDate(ErrorMessage = "Booking date must be in the future.")]
        public DateTime BookingDate { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }

        public int UserId { get; set; }

        // Change User property to reference User entity
        public User User { get; set; }

        [Required]
        public int ActivityId { get; set; }

        public Activity Activity { get; set; }
    }

    public class FutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            DateTime date = (DateTime)value;
            return date > DateTime.Now;
        }
    }
}
