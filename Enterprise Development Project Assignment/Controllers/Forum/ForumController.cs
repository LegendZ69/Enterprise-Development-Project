using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Enterprise_Development_Project_Assignment.Models;
using System.Threading.Tasks;
using System.Linq;
using Enterprise_Development_Project_Assignment.Helpers;
namespace Enterprise_Development_Project_Assignment.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ThreadController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ThreadController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Thread
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThreadModel>>> GetThreads()
        {
            return await _context.Threads.ToListAsync();
        }

        // GET: api/Thread/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ThreadModel>> GetThread(string id)
        {
            var thread = await _context.Threads.FindAsync(id);

            if (thread == null)
            {
                return NotFound();
            }

            return thread;
        }

        // POST: api/Thread
        [HttpPost]
        public async Task<ActionResult<ThreadModel>> CreateThread(ThreadModel thread)
        {
            _context.Threads.Add(thread);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetThread", new { id = thread.Id }, thread);
        }

        // PUT: api/Thread/5
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
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Threads.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Thread/5 (Optional)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteThread(string id)
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
    }
}
