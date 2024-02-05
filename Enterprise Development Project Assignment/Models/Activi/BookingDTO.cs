﻿using System;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class BookingDTO
    {
        public int Id { get; set; }
        public int ActivityId { get; set; }
        public int UserId { get; set; }
        public DateTime BookingDate { get; set; }
        public UserBasicDTO User { get; set; }
        public int Quantity { get; set; }
    }
}
