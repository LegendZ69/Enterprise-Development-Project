namespace Enterprise_Development_Project_Assignment.Models
{
    public class AuditLogDTO
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? Action { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
