

using System.ComponentModel.DataAnnotations;

namespace Enterprise_Development_Project_Assignment.Models.Forum
{
    public class ReplyModel
    {

        public int Id { get; set; }
        public string Content { get; set; }
        public int ThreadId { get; set; } // Reference to the thread ID
        public string CreatedBy { get; set; } // Username

        public int CreatedByUserId { get; set; } //user id
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow; // Consider storing UTC time
    }


}
