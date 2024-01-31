﻿using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
	public class ActivityDTO
	{
		public int Id { get; set; }
		public string Title { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public string? Category { get; set; }
        public string? ImageFile { get; set; }
        public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }
		public int UserId { get; set; }
		public UserBasicDTO? User { get; set; }
	}
}
