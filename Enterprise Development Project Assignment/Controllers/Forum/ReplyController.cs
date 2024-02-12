
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Enterprise_Development_Project_Assignment.Models;
using System.Threading.Tasks;
using Enterprise_Development_Project_Assignment;
using Enterprise_Development_Project_Assignment.Controllers;
using Enterprise_Development_Project_Assignment.Helpers;

[Route("[controller]")]
[ApiController]
public class ReplyController : ControllerBase
{
    private readonly MyDbContext _context;
    private readonly ILogger<ThreadController> _logger; // Make sure the logger type matches the current controller
    private readonly AuditLogHelper _auditLogHelper;

    public ReplyController(MyDbContext context, ILogger<ThreadController> logger, AuditLogHelper auditLogHelper)
    {
        _context = context;
        _logger = logger;
        _auditLogHelper = auditLogHelper;
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
    public async Task<ActionResult<ReplyModel>> PostReply(ReplyModel reply)
    {

        try
        {
            _context.Replies.Add(reply);
            await _context.SaveChangesAsync();
            _auditLogHelper.LogUserActivityAsync(reply.CreatedByUserId.ToString(), $"User id: {reply.CreatedByUserId.ToString()} posted a a reply {reply.Content}").Wait();
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
        _auditLogHelper.LogUserActivityAsync(reply.CreatedByUserId.ToString(), $"User id: {reply.CreatedByUserId.ToString()} deleted a reply:  {reply.Content}").Wait();
        return NoContent(); // Indicates successful deletion without sending back data
    }


}