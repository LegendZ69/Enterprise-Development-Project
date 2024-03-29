﻿using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class BookingActivityRequest
    {
        [Required]
        public DateTime BookingDate { get; set; }

        public int Quantity { get; set; }

        public string SelectedTimeSlot { get; set; } // Include property for selected time slot
    }
}   

