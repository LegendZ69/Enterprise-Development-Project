using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SuggestionFormController : ControllerBase
    {
        private readonly MyDbContext _context;

        public SuggestionFormController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            IQueryable<SuggestionForm> result = _context.SuggestionForms;
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
        public IActionResult GetSuggestionForm(int id)
        {
            SuggestionForm? suggestionForm = _context.SuggestionForms.Find(id);
            if (suggestionForm == null)
            {
                return NotFound();
            }
            return Ok(suggestionForm);
        }

        [HttpPost]
        public IActionResult AddSuggestionForm(SuggestionForm suggestionForm)
        {
            var now = DateTime.Now;
            var mySuggestionForm = new SuggestionForm()
            {
                //only can trim string
                Email = suggestionForm.Email.Trim(),
                ActivityName = suggestionForm.ActivityName.Trim(),
                ActivityType = suggestionForm.ActivityType.Trim(),
                ActivityDescription = suggestionForm.ActivityDescription.Trim(),
                ActivityReason = suggestionForm.ActivityReason.Trim(),
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.SuggestionForms.Add(mySuggestionForm);
            _context.SaveChanges();
            return Ok(mySuggestionForm);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateSuggestionForm(int id, SuggestionForm suggestionForm)
        {
            var mySuggestionForm = _context.SuggestionForms.Find(id);
            if (mySuggestionForm == null)
            {
                return NotFound();
            }
            mySuggestionForm.Email = suggestionForm.Email.Trim();
            mySuggestionForm.ActivityName = suggestionForm.ActivityName.Trim();
            mySuggestionForm.ActivityType = suggestionForm.ActivityType.Trim();
            mySuggestionForm.ActivityDescription = suggestionForm.ActivityDescription.Trim();
            mySuggestionForm.ActivityReason = suggestionForm.ActivityReason.Trim();
            mySuggestionForm.UpdatedAt = DateTime.Now;
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSuggestionForm(int id)
        {
            var mySuggestionForm = _context.SuggestionForms.Find(id);
            if (mySuggestionForm == null)
            {
                return NotFound();
            }
            _context.SuggestionForms.Remove(mySuggestionForm);
            _context.SaveChanges();
            return Ok();
        }

    }
}
