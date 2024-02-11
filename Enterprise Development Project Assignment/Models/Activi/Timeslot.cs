namespace Enterprise_Development_Project_Assignment.Models.Activi
{
    public class Timeslot
    {
        public int Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ActivityId { get; set; }
        public Activity Activity { get; set; }
    }
}
