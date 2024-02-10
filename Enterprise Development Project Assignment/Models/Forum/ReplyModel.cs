

using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models
{
    public class ReplyModel
    {
        [Key]
        public string Id { get; set; }
        public string Content { get; set; }
        public string ThreadId { get; set; } // Reference to the thread ID
        public string CreatedBy { get; set; } // Username
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow; // Consider storing UTC time
    }


}
