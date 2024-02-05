using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Enterprise_Development_Project_Assignment.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Enterprise_Development_Project_Assignment.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class ActivityController : ControllerBase
	{
		private readonly MyDbContext _context;
		private readonly IMapper _mapper;

		public ActivityController(MyDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		private int GetUserId()
		{
			return Convert.ToInt32(User.Claims
			.Where(c => c.Type == ClaimTypes.NameIdentifier)
			.Select(c => c.Value).SingleOrDefault());
		}

		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<ActivityDTO>), StatusCodes.Status200OK)]
		public IActionResult GetAll(string? search)
		{
			IQueryable<Activity> result = _context.Activities.Include(a => a.User);

			if (search != null)
			{
				result = result.Where(x => x.Title.Contains(search) || x.Description.Contains(search));
			}

			var list = result.OrderByDescending(x => x.CreatedAt).ToList();
			IEnumerable<ActivityDTO> data = list.Select(a => _mapper.Map<ActivityDTO>(a));
			return Ok(data);
		}

        [HttpPost, Authorize]
        [ProducesResponseType(typeof(ActivityDTO), StatusCodes.Status200OK)]
        public IActionResult AddActivity(AddActivityRequests activity)
        {
            int userId = GetUserId();
            var now = DateTime.Now;

            var myActivity = new Activity()
            {
                Title = activity.Title.Trim(),
                Description = activity.Description.Trim(),
                ImageFile = activity.ImageFile,
                Price = activity.Price, // Add Price property
                Category = activity.Category, // Add Category property
                CreatedAt = now,
                UpdatedAt = now,
                UserId = userId
            };

            _context.Activities.Add(myActivity);
            _context.SaveChanges();

            Activity? newActivity = _context.Activities.Include(t => t.User)
                .FirstOrDefault(t => t.Id == myActivity.Id);
            ActivityDTO activityDTO = _mapper.Map<ActivityDTO>(newActivity);
            return Ok(activityDTO);
        }


        [HttpGet("{id}")]
		[ProducesResponseType(typeof(ActivityDTO), StatusCodes.Status200OK)]
		public IActionResult GetTutorial(int id)
		{
			Activity? activity = _context.Activities.Include(a => a.User).FirstOrDefault(a => a.Id == id);
			if (activity == null)
			{
				return NotFound();
			}
			ActivityDTO data = _mapper.Map<ActivityDTO>(activity);
			return Ok(data);
		}

        [HttpPut("{id}"), Authorize]
        public IActionResult UpdateTutorial(int id, UpdateActivityRequest activity)
        {
            var myActivity = _context.Activities.Find(id);
            if (myActivity == null)
            {
                return NotFound();
            }

            int userId = GetUserId();
            if (myActivity.UserId != userId)
            {
                return Forbid();
            }

            if (activity.Title != null)
            {
                myActivity.Title = activity.Title.Trim();
            }
            if (activity.Description != null)
            {
                myActivity.Description = activity.Description.Trim();
            }
            if (activity.ImageFile != null)
            {
                myActivity.ImageFile = activity.ImageFile;
            }
            if (activity.Price != null) 
            {
                myActivity.Price = activity.Price;
            }
            if (activity.Category != null) 
            {
                myActivity.Category = activity.Category;
            }

            _context.SaveChanges();
            return Ok();
        }


        [HttpDelete("{id}")]
		public IActionResult DeleteTutorial(int id)
		{
			var myActivity = _context.Activities.Find(id);
			if (myActivity == null)
			{
				return NotFound();
			}
			_context.Activities.Remove(myActivity);
			_context.SaveChanges();
			return Ok();
		}

		//[HttpPost("book/{id}"), Authorize]
		//[ProducesResponseType(typeof(BookingDTO), StatusCodes.Status200OK)]
		//public IActionResult BookActivity(int id, BookingActivityRequest request)
		//{
		//	int userId = GetUserId();

		//	var existingBooking = _context.Bookings
		//		.FirstOrDefault(b => b.ActivityId == id && b.UserId == userId);

		//	if (existingBooking != null)
		//	{
		//		string message = "You have already booked this activity.";
		//		return BadRequest(new { message });
		//	}

		//	var booking = new Booking
		//	{
		//		ActivityId = id,
		//		UserId = userId,
		//		BookingDate = request.BookingDate
		//	};

		//	_context.Bookings.Add(booking);
		//	_context.SaveChanges();

		//	var bookingDTO = _mapper.Map<BookingDTO>(booking);
		//	return Ok(bookingDTO);
		//}

		//[HttpGet("book/{bookingId}"), Authorize]
		//[ProducesResponseType(typeof(BookingDTO), StatusCodes.Status200OK)]
		//public IActionResult GetBooking(int bookingId)
		//{
		//	int userId = GetUserId();

		//	var booking = _context.Bookings
		//		.Include(b => b.Activity)
		//		.FirstOrDefault(b => b.Id == bookingId && b.UserId == userId);

		//	if (booking == null)
		//	{
		//		return NotFound();
		//	}

		//	var bookingDTO = _mapper.Map<BookingDTO>(booking);
		//	return Ok(bookingDTO);
		//}

        [HttpGet("category/{category}")]
        [ProducesResponseType(typeof(IEnumerable<ActivityDTO>), StatusCodes.Status200OK)]
        public IActionResult GetActivitiesByCategory(string category, string? search)
        {
            IQueryable<Activity> result = _context.Activities.Include(a => a.User);

            if (!string.IsNullOrEmpty(category) && category.ToLower() != "all")
            {
                result = result.Where(x => x.Category == category);
            }

            if (!string.IsNullOrEmpty(search))
            {
                result = result.Where(x => x.Title.Contains(search) || x.Description.Contains(search));
            }

            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            IEnumerable<ActivityDTO> data = list.Select(a => _mapper.Map<ActivityDTO>(a));
            return Ok(data);
        }

    }
}
