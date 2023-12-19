using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;

//addons to link with User, create additional separate method for staff
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SuggestionFormController : ControllerBase
    {
        //comment to avoid build error
        /*private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
            .Where(c => c.Type == ClaimTypes.NameIdentifier)
            .Select(c => c.Value).SingleOrDefault());
        }*/

        private readonly MyDbContext _context;

        public SuggestionFormController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            //to include user object
            /*IQueryable<SuggestionForm> result = _context.SuggestionForms.Include(t => t.User);*/
            IQueryable<SuggestionForm> result = _context.SuggestionForms; //delete this when combine
            if (search != null)
            {
                result = result.Where(x => x.Email.Contains(search)
                || x.ActivityName.Contains(search)
/*                || x.ActivityTypez.Contains(search)
*/                || x.ActivityDescription.Contains(search)
                || x.ActivityReason.Contains(search)
                );
            }
            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            //combine with user
            /*var data = list.Select(t => new
            {
                t.Id,
                t.Email,
                t.ActivityName,
                t.ActivityType,
                t.ActivityDescription,
                t.ActivityReason,
                t.CreatedAt,
                t.UpdatedAt,
                t.UserId,
                User = new
                {
                    t.User?.Name //return form data + user name only
                }
            });*/

            return Ok(list); //change list to data when combine
        }

        [HttpGet("{id}")]
        public IActionResult GetSuggestionForm(int id)
        {
            /*            SuggestionForm? suggestionForm = _context.SuggestionForms.Include(t => t.User).FirstOrDefault(t => t.Id == id);*/
            SuggestionForm? suggestionForm = _context.SuggestionForms.Find(id);
            if (suggestionForm == null)
            {
                return NotFound();
            }
            /*var data = new
            {
                tutorial.Id,
                tutorial.Title,
                tutorial.Description,
                tutorial.CreatedAt,
                tutorial.UpdatedAt,
                tutorial.UserId,
                User = new
                {
                    tutorial.User?.Name
                }
            };*/
            return Ok(suggestionForm);
        }

        /*[HttpPost, Authorize]*/ //only authorised user can add / bind form to userid
        [HttpPost]
        public IActionResult AddSuggestionForm(SuggestionForm suggestionForm)
        {
/*            int userId = GetUserId();*/
            var now = DateTime.Now;
            var mySuggestionForm = new SuggestionForm()
            {
                //only can trim string
                Email = suggestionForm.Email.Trim().ToLower(),
                ActivityName = suggestionForm.ActivityName.Trim(),
                ActivityType = suggestionForm.ActivityType,
                ActivityDescription = suggestionForm.ActivityDescription.Trim(),
                ActivityReason = suggestionForm.ActivityReason.Trim(),
                CreatedAt = now,
                UpdatedAt = now
/*                UserId = userId */
            };

            _context.SuggestionForms.Add(mySuggestionForm);
            _context.SaveChanges();
            return Ok(mySuggestionForm);
        }

        /*[HttpPut("{id}"), Authorize]*/ //only authorised user can edit
        [HttpPut("{id}")]
        public IActionResult UpdateSuggestionForm(int id, SuggestionForm suggestionForm)
        {
            var mySuggestionForm = _context.SuggestionForms.Find(id);
            if (mySuggestionForm == null)
            {
                return NotFound();
            }

            //think can put in GetAll to display their own form
            /*int userId = GetUserId();
            if (mySuggestionForm.UserId != userId)
            {
                return Forbid(); //prevent edit if userid bound to form not match userid who want to edit
            }*/

            mySuggestionForm.Email = suggestionForm.Email.Trim().ToLower();
            mySuggestionForm.ActivityName = suggestionForm.ActivityName.Trim();
            mySuggestionForm.ActivityType = suggestionForm.ActivityType;
            mySuggestionForm.ActivityDescription = suggestionForm.ActivityDescription.Trim();
            mySuggestionForm.ActivityReason = suggestionForm.ActivityReason.Trim();
            mySuggestionForm.UpdatedAt = DateTime.Now;
            _context.SaveChanges();
            return Ok();
        }

        /*[HttpDelete("{id}"), Authorize]*/ //only authorised user can delete
        [HttpDelete("{id}")]
        public IActionResult DeleteSuggestionForm(int id)
        {
            var mySuggestionForm = _context.SuggestionForms.Find(id);
            if (mySuggestionForm == null)
            {
                return NotFound();
            }

            /*int userId = GetUserId();
            if (mySuggestionForm.UserId != userId)
            {
                return Forbid(); //prevent edit if userid bound to form not match userid who want to edit
            }*/

            _context.SuggestionForms.Remove(mySuggestionForm);
            _context.SaveChanges();
            return Ok();
        }
    }
}
