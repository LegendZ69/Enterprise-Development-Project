using Enterprise_Development_Project_Assignment.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class AddActivityRequests
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string? ImageFile { get; set; }

        public decimal? Price { get; set; }

        public string? Category { get; set; }

        public string? Location { get; set; }
        
        public DateTime EventDate { get; set; }

        public List<TimeslotDTO> Timeslots { get; set; }


    }
}
