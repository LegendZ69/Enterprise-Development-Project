using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class UpdateActivityRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageFile { get; set; }
        public decimal? Price { get; set; } // Add Price property
        public string? Category { get; set; } // Add Category property
    }
}
