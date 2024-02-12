using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Enterprise_Development_Project_Assignment.Models;
using System.Threading.Tasks;
using System.Linq;
using Enterprise_Development_Project_Assignment.Helpers;
using Microsoft.Extensions.Logging;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ThreadController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly ILogger<ThreadController> _logger; // Make sure the logger type matches the current controller
        private readonly AuditLogHelper _auditLogHelper;

        public ThreadController(MyDbContext context, ILogger<ThreadController> logger, AuditLogHelper auditLogHelper)
        {
            _context = context;
            _logger = logger;
            _auditLogHelper = auditLogHelper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThreadModel>>> GetThreads()
        {
            try
            {
                var threads = await _context.Threads.ToListAsync();
               
                return threads;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving threads.");
                return StatusCode(500, "Internal server error while retrieving threads.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ThreadModel>> GetThread(int id)
        {
            try
            {
                var thread = await _context.Threads.FindAsync(id);
                if (thread == null)
                {
                    return NotFound();
                }
                return thread;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while retrieving thread with ID {id}.");
                return StatusCode(500, "Internal server error while retrieving thread.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ThreadModel>> CreateThread(ThreadModel thread)
        {
            try
            {
                _context.Threads.Add(thread);
                await _context.SaveChangesAsync();
                _auditLogHelper.LogUserActivityAsync(thread.CreatedByUserId.ToString(), $"Created a thread id : {thread.Id}").Wait();
                return CreatedAtAction("GetThread", new { id = thread.Id }, thread);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a thread.");
                return StatusCode(500, "Internal server error while creating thread.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateThread(int id, ThreadModel thread)
        {
            if (id != thread.Id)
            {
                return BadRequest();
            }

            _context.Entry(thread).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!_context.Threads.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    _logger.LogError(ex, $"A concurrency error occurred while updating thread with ID {id}.");
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while updating thread with ID {id}.");
                return StatusCode(500, "Internal server error while updating thread.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteThread(int id)
        {
            try
            {
                var thread = await _context.Threads.FindAsync(id);
                if (thread == null)
                {
                    return NotFound();
                }

                _context.Threads.Remove(thread);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while deleting thread with ID {id}.");
                return StatusCode(500, "Internal server error while deleting thread.");
            }
        }

        [HttpPost("{id}/upvote")]
        public async Task<IActionResult> UpvoteThread(int id)
        {
            var thread = await _context.Threads.FindAsync(id);

            if (thread == null)
            {
                return NotFound();
            }

            thread.Votes += 1; // Increment the vote count
            await _context.SaveChangesAsync();

            return Ok(thread); // Or return NoContent(); based on your API design
        }
        [HttpPost("{id}/downvote")]
        public async Task<IActionResult> DownvoteThread(int id)
        {
            var thread = await _context.Threads.FindAsync(id);
            if (thread == null)
            {
                return NotFound();
            }

            thread.Votes -= 1; // Decrement the vote count
            await _context.SaveChangesAsync();

            return Ok(thread); // Or return NoContent(); based on your API design
        }
    }
}
