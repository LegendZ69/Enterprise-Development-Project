using System;
using System.ComponentModel.DataAnnotations;
namespace Enterprise_Development_Project_Assignment.Models
{
    public class ThreadModel
    {
        [Key]
        public string Id { get; set; } 
        public string Title { get; set; }   
        public string Description { get; set; }
        public string CreatedBy { get; set; } // Username
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow; // Consider storing UTC time
        
    }

}