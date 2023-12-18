using Enterprise_Development_Project_Assignment.Models;
using Microsoft.AspNetCore.Mvc;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RatingsAndReviewsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public RatingsAndReviewsController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll(string? search)
        {
            IQueryable<RatingsAndReviews> result = _context.RatingsAndReviews;
            if (search != null)
            {
                result = result.Where(x => x.BookingId.ToString().Contains(search)
                || x.BookingDate.ToString().Contains(search)
                || x.FirstName.Contains(search)
                || x.LastName.Contains(search)
                || x.Rating.ToString().Contains(search)
                || x.Opinion.Contains(search)
                || x.CreatedAt.ToString().Contains(search)
                || x.UpdatedAt.ToString().Contains(search));
            }
            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public IActionResult GetRatingsAndReviews(int id)
        {
            RatingsAndReviews? RatingsAndReviews = _context.RatingsAndReviews.Find(id);
            if (RatingsAndReviews == null)
            {
                return NotFound();
            }
            return Ok(RatingsAndReviews);
        }

        [HttpPost]
        public IActionResult AddRatingsAndReviews(RatingsAndReviews RatingsAndReviews)
        {
            var now = DateTime.Now;
            var myRatingsAndReviews = new RatingsAndReviews()
            {
                //only can trim string
                BookingId = RatingsAndReviews.BookingId,
                BookingDate = RatingsAndReviews.BookingDate,
                FirstName = RatingsAndReviews.FirstName.Trim(),
                LastName = RatingsAndReviews.LastName.Trim(),
                Rating = RatingsAndReviews.Rating,
                CreatedAt = now,
                UpdatedAt = now
            };

            _context.RatingsAndReviews.Add(myRatingsAndReviews);
            _context.SaveChanges();
            return Ok(myRatingsAndReviews);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRatingsAndReviews(int id, RatingsAndReviews RatingsAndReviews)
        {
            var myRatingsAndReviews = _context.RatingsAndReviews.Find(id);
            if (myRatingsAndReviews == null)
            {
                return NotFound();
            }
            myRatingsAndReviews.BookingId = RatingsAndReviews.BookingId;
            myRatingsAndReviews.BookingDate = RatingsAndReviews.BookingDate;
            myRatingsAndReviews.FirstName = RatingsAndReviews.FirstName.Trim();
            myRatingsAndReviews.LastName = RatingsAndReviews.LastName.Trim();
            myRatingsAndReviews.Rating = RatingsAndReviews.Rating;
            myRatingsAndReviews.Opinion = RatingsAndReviews.Opinion.Trim();
            myRatingsAndReviews.UpdatedAt = DateTime.Now;
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRatingsAndReviews(int id)
        {
            var myRatingsAndReviews = _context.RatingsAndReviews.Find(id);
            if (myRatingsAndReviews == null)
            {
                return NotFound();
            }
            _context.RatingsAndReviews.Remove(myRatingsAndReviews);
            _context.SaveChanges();
            return Ok();
        }
    }
}
