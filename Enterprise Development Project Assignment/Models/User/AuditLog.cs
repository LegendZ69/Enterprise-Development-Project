namespace Enterprise_Development_Project_Assignment.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? Action { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
