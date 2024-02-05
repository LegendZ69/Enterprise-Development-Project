﻿using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Enterprise_Development_Project_Assignment.Models
{
	public class User
	{
		public int Id { get; set; }

		[MaxLength(50)]
		public string Name { get; set; } = string.Empty;

		[MaxLength(50)]
		public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? ImageFile { get; set; }

        [MaxLength(100), JsonIgnore]
		public string Password { get; set; } = string.Empty;

		[Column(TypeName = "datetime")]
		public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }
		[MaxLength(8)]
		public string PhoneNumber { get; set; } = string.Empty;

		public string Role { get; set; } = string.Empty;

		
		//// Navigation property to represent the one-to-many relationship
		[JsonIgnore]
		public List<Activity>? Activities { get; set; }
	}
}
