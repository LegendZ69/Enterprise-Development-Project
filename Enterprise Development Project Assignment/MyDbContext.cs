using Enterprise_Development_Project_Assignment.Models;
using Microsoft.EntityFrameworkCore;

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
        public DbSet<SuggestionForm> SuggestionForms { get; set; }
    }
}