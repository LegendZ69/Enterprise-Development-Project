using Enterprise_Development_Project_Assignment.Models;using Microsoft.EntityFrameworkCore;

namespace Enterprise_Development_Project_Assignment
{
    public class MyDbContext : DbContext
    {
        private readonly IConfiguration _configuration;
        public MyDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string? connectionString = _configuration.GetConnectionString("MyConnection");
            if (connectionString != null)
            {
                optionsBuilder.UseSqlServer(connectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Activities)
                .WithOne(a => a.User)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Bookings)
                .WithOne(b => b.User)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Activity>()
                .HasMany(a => a.Bookings)
                .WithOne(b => b.Activity)
                .OnDelete(DeleteBehavior.Restrict);

            // ... other configurations
        }



        public DbSet<SuggestionForm> SuggestionForms { get; set; }
        public DbSet<FeedbackForm> FeedbackForms { get; set; }
        public DbSet<RatingsAndReviews> RatingsAndReviews { get; set; }
        public DbSet<Coupons> Coupons { get; set; }
        public DbSet<CreditCard> CreditCard { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
    }
}