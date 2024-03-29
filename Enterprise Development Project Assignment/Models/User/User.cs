﻿using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
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

        [Required(ErrorMessage = "Password is required")]
        [MinLength(12, ErrorMessage = "Password must be at least 12 characters long")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,}$", ErrorMessage = "Password must include lowercase, uppercase, number, and special character")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

		[Column(TypeName = "datetime")]
		public DateTime UpdatedAt { get; set; }
        [RegularExpression(@"^\d{8}$", ErrorMessage = "Phone number must be 8 digits.")]
        public string PhoneNumber { get; set; } = string.Empty;
        public string? PasswordResetToken { get; set; } = string.Empty;
        [Column(TypeName = "datetime")]
        public DateTime? ResetTokenExpires { get; set; }

        public string Role { get; set; } = string.Empty;

        public string Status {  get; set; } = string.Empty;
        [Column(TypeName = "datetime")]
        public DateTime? Deactivefully { get; set; }
        public bool TwoFactorEnabled { get; set; } = false;
        public string VerificationCode {  get; set; } = string.Empty;


        //// Navigation property to represent the one-to-many relationship
        [JsonIgnore]
		public List<Activity>? Activities { get; set; }
        public List<FeedbackForm>? FeedbackForms { get; set; }
        public List<SuggestionForm>? SuggestionForms { get; set; }
        public List<RatingsAndReviews>? RatingsAndReviews { get; set; }
        public List<Payment>? Payments {  get; set; }
        public List<CreditCard>? CreditCards { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
       
 }

