using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Enterprise_Development_Project_Assignment;
using Enterprise_Development_Project_Assignment.Models.Forum;

[Route("[controller]")]
[ApiController]
public class ReplyController : ControllerBase
{
    private readonly MyDbContext _context;

    public ReplyController(MyDbContext context)
    {
        _context = context;
    }

    // GET: api/Reply/{threadId}
    [HttpGet("{threadId}")]
    public async Task<ActionResult<ReplyModel>> GetRepliesForThread(int threadId)
    {
        var replies = await _context.Replies
                                     .Where(r => r.ThreadId == threadId)
                                     .ToListAsync();
        return Ok(replies);
    }

    // POST: api/Reply
    [HttpPost]
    public async Task<ActionResult<ReplyModel>> PostReply( ReplyModel reply)
    {

        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _context.Replies.Add(reply);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRepliesForThread), new { threadId = reply.ThreadId }, reply);

        }
        catch (Exception ex)
        {
            // Log the exception and return a server error response

            return StatusCode(500, "Internal server error");
        }
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult<ReplyModel>> DeleteReply(int id)
    {
        var reply = await _context.Replies.FindAsync(id);
        if (reply == null)
        {
            return NotFound();
        }

        _context.Replies.Remove(reply);
        await _context.SaveChangesAsync();

        return NoContent(); // Indicates successful deletion without sending back data
    }

   
}
