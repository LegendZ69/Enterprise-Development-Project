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
                || x.ActivityName.Contains(search)
                || x.ActivityType.Contains(search)
                || x.ActivityDescription.Contains(search)
                || x.ActivityReason.Contains(search));
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
                Email = FeedbackForm.Email.Trim(),
                ActivityName = FeedbackForm.ActivityName.Trim(),
                ActivityType = FeedbackForm.ActivityType.Trim(),
                ActivityDescription = FeedbackForm.ActivityDescription.Trim(),
                ActivityReason = FeedbackForm.ActivityReason.Trim(),
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
            myFeedbackForm.Email = FeedbackForm.Email.Trim();
            myFeedbackForm.ActivityName = FeedbackForm.ActivityName.Trim();
            myFeedbackForm.ActivityType = FeedbackForm.ActivityType.Trim();
            myFeedbackForm.ActivityDescription = FeedbackForm.ActivityDescription.Trim();
            myFeedbackForm.ActivityReason = FeedbackForm.ActivityReason.Trim();
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
