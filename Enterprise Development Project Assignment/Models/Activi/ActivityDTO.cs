using Enterprise_Development_Project_Assignment.Models.Activi;
using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
	public class ActivityDTO
	{
		public int Id { get; set; }
		public string? Title { get; set; }
		public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? Category { get; set; }
        public string? ImageFile { get; set; }
		public string? Location { get; set; }
		public DateTime EventDate { get; set; }
        public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; } 
        public int UserId { get; set; }
		public UserBasicDTO? User { get; set; }
        public IEnumerable<TimeslotDTO> Timeslots { get; set; }

    }
}
