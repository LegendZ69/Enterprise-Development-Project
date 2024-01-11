using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FeedbackFormController : ControllerBase
    {
        private readonly MyDbContext _context;

        public FeedbackFormController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            IQueryable<FeedbackForm> result = _context.FeedbackForms;
            if (search != null)
            {
                result = result.Where(x => x.Email.Contains(search)
                || x.FirstName.Contains(search)
                || x.LastName.Contains(search)
                || x.Topic.Contains(search)
                || x.Message.Contains(search)
                );
            }
            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public IActionResult GetFeedbackForm(int id)
        {
            FeedbackForm? FeedbackForm = _context.FeedbackForms.Find(id);
            if (FeedbackForm == null)
            {
                return NotFound();
            }
            return Ok(FeedbackForm);
        }

        [HttpPost]
        public IActionResult AddFeedbackForm(FeedbackForm FeedbackForm)
        {
            var now = DateTime.Now;
            var myFeedbackForm = new FeedbackForm()
            {
                //only can trim string
                Email = FeedbackForm.Email.Trim().ToLower(),
                FirstName = FeedbackForm.FirstName.Trim(),
                LastName = FeedbackForm.LastName.Trim(),
                Topic = FeedbackForm.Topic,
                Message = FeedbackForm.Message.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.FeedbackForms.Add(myFeedbackForm);
            _context.SaveChanges();
            return Ok(myFeedbackForm);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateFeedbackForm(int id, FeedbackForm FeedbackForm)
        {
            var myFeedbackForm = _context.FeedbackForms.Find(id);
            if (myFeedbackForm == null)
            {
                return NotFound();
            }
            myFeedbackForm.Email = FeedbackForm.Email.Trim().ToLower();
            myFeedbackForm.FirstName = FeedbackForm.FirstName.Trim();
            myFeedbackForm.LastName = FeedbackForm.LastName.Trim();
            myFeedbackForm.Topic = FeedbackForm.Topic;
            myFeedbackForm.Message = FeedbackForm.Message.Trim();
            myFeedbackForm.StaffRemark = FeedbackForm.StaffRemark.Trim();
            myFeedbackForm.UpdatedAt = DateTime.Now;
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFeedbackForm(int id)
        {
            var myFeedbackForm = _context.FeedbackForms.Find(id);
            if (myFeedbackForm == null)
            {
                return NotFound();
            }
            _context.FeedbackForms.Remove(myFeedbackForm);
            _context.SaveChanges();
            return Ok();
        }
    }
}
