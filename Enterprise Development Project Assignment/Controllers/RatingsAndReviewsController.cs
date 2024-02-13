using AutoMapper;
using Enterprise_Development_Project_Assignment.Helpers;
using Enterprise_Development_Project_Assignment.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Security.Claims;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RatingsAndReviewsController : ControllerBase
    {
        private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value).SingleOrDefault());
        }

        private readonly MyDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<RatingsAndReviewsController> _logger;
        private readonly AuditLogHelper _auditLogHelper;

        public RatingsAndReviewsController(MyDbContext context, IMapper mapper, ILogger<RatingsAndReviewsController> logger, AuditLogHelper auditLogHelper)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _auditLogHelper = auditLogHelper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<RatingsAndReviewsDTO>), StatusCodes.Status200OK)]
        public IActionResult GetAll(string? search)
        {
            try
            {
                IQueryable<RatingsAndReviews> result = _context.RatingsAndReviews.Include(t => t.User)
                    .Include(a => a.Activity)
                    .Include(b => b.Booking);
                if (search != null)
                {
                    result = result.Where(x =>
    /*                x.BookingId.ToString().Contains(search)
    *//*                || x.BookingDate.ToString().Contains(search)
    */                 x.FirstName.Contains(search)
                    || x.LastName.Contains(search)
    /*                || x.Rating.ToString().Contains(search)
    */                || x.Review.Contains(search)
                    );
                }
                var list = result.OrderByDescending(x => x.CreatedAt).ToList();
                IEnumerable<RatingsAndReviewsDTO> data = list.Select(t => _mapper.Map<RatingsAndReviewsDTO>(t));
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when get all ratings and reviews");
                return StatusCode(500);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(RatingsAndReviewsDTO), StatusCodes.Status200OK)]
        public IActionResult GetRatingsAndReviews(int id)
        {
            try
            {
                RatingsAndReviews? ratingsAndReviews = _context.RatingsAndReviews.Include(t => t.User)
                    .Include(a => a.Activity)
                    .Include(b => b.Booking)
                    .FirstOrDefault(t => t.Id == id);
                if (ratingsAndReviews == null)
                {
                    return NotFound();
                }
                RatingsAndReviewsDTO data = _mapper.Map<RatingsAndReviewsDTO>(ratingsAndReviews);
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when get id rating and review");
                return StatusCode(500);
            }
        }

        [HttpPost, Authorize]
        [ProducesResponseType(typeof(RatingsAndReviewsDTO), StatusCodes.Status200OK)]
        public IActionResult AddRatingsAndReviews(AddRatingsAndReviewsRequest ratingsAndReviews)
        {
            try
            {
                int userId = GetUserId();
                var now = DateTime.Now;
                var myRatingsAndReviews = new RatingsAndReviews()
                {
                    //only can trim string
                    /*BookingId = RatingsAndReviews.BookingId,
                    BookingDate = RatingsAndReviews.BookingDate,*/
                    Email = ratingsAndReviews.Email.Trim().ToLower(),
                    FirstName = ratingsAndReviews.FirstName.Trim(),
                    LastName = ratingsAndReviews.LastName.Trim(),
                    Rating = ratingsAndReviews.Rating,
                    Review = ratingsAndReviews.Review.Trim(),
                    ImageFile = ratingsAndReviews.ImageFile,
                    CreatedAt = now,
                    UpdatedAt = now,
                    UserId = userId,
                };

                _context.RatingsAndReviews.Add(myRatingsAndReviews);
                _context.SaveChanges();

                RatingsAndReviews? newRatingsAndReviews = _context.RatingsAndReviews.Include(t => t.User)
                    .Include(a => a.Activity)
                    .Include(b => b.Booking)
                    .FirstOrDefault(t => t.Id == myRatingsAndReviews.Id);
                RatingsAndReviewsDTO ratingsAndReviewsDTO = _mapper.Map<RatingsAndReviewsDTO>(newRatingsAndReviews);
                _auditLogHelper.LogUserActivityAsync(myRatingsAndReviews.UserId.ToString(), "User ID " + myRatingsAndReviews.UserId + " posted Review ID " + myRatingsAndReviews.Id).Wait();
                return Ok(ratingsAndReviewsDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when post rating and review");
                return StatusCode(500);
            }
        }

        [HttpPut("{id}"), Authorize(Roles = "user")]
        public IActionResult UpdateRatingsAndReviews(int id, UpdateRatingsAndReviewsRequest ratingsAndReviews)
        {
            try
            {
                var myRatingsAndReviews = _context.RatingsAndReviews.Find(id);
                if (myRatingsAndReviews == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (myRatingsAndReviews.UserId != userId)
                {
                    return Forbid();
                }

                /*if (ratingsAndReviews.BookingId != null)
                {
                    myRatingsAndReviews.BookingId = ratingsAndReviews.BookingId.Trim();
                }
                if (ratingsAndReviews.BookingDate != null)
                {
                    myRatingsAndReviews.BookingDate = ratingsAndReviews.BookingDate.Trim();
                }*/
                if (ratingsAndReviews.Email != null)
                {
                    myRatingsAndReviews.Email = ratingsAndReviews.Email.Trim().ToLower();
                }
                if (ratingsAndReviews.FirstName != null)
                {
                    myRatingsAndReviews.FirstName = ratingsAndReviews.FirstName.Trim();
                }
                if (ratingsAndReviews.LastName != null)
                {
                    myRatingsAndReviews.LastName = ratingsAndReviews.LastName.Trim();
                }
                if (ratingsAndReviews.Rating != null)
                {
                    myRatingsAndReviews.Rating = ratingsAndReviews.Rating;
                }
                if (ratingsAndReviews.Review != null)
                {
                    myRatingsAndReviews.Review = ratingsAndReviews.Review.Trim();
                }
                if (ratingsAndReviews.ImageFile != null)
                {
                    myRatingsAndReviews.ImageFile = ratingsAndReviews.ImageFile;
                }
                myRatingsAndReviews.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(myRatingsAndReviews.UserId.ToString(), "User ID " + myRatingsAndReviews.UserId + " updated Review ID " + myRatingsAndReviews.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when put id rating and review");
                return StatusCode(500);
            }
        }

        [HttpPut("admin/{id}"), Authorize(Roles = "admin")]
        public IActionResult UpdateRatingsAndReviewsAdmin(int id, UpdateRatingsAndReviewsRequest ratingsAndReviews)
        {
            try
            {
                var myRatingsAndReviews = _context.RatingsAndReviews.Find(id);
                if (myRatingsAndReviews == null)
                {
                    return NotFound();
                }

                if (ratingsAndReviews.StaffRemark != null)
                {
                    myRatingsAndReviews.StaffRemark = ratingsAndReviews.StaffRemark.Trim();
                }
                myRatingsAndReviews.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(myRatingsAndReviews.UserId.ToString(), "Admin left staff remark on Review ID " + myRatingsAndReviews.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when put id rating and review ADMIN");
                return StatusCode(500);
            }
        }

        [HttpDelete("{id}"), Authorize(Roles = "user")]
        public IActionResult DeleteRatingsAndReviews(int id)
        {
            try
            {
                var myRatingsAndReviews = _context.RatingsAndReviews.Find(id);
                if (myRatingsAndReviews == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (myRatingsAndReviews.UserId != userId)
                {
                    return Forbid();
                }

                _context.RatingsAndReviews.Remove(myRatingsAndReviews);
                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(myRatingsAndReviews.UserId.ToString(), "User ID " + myRatingsAndReviews.UserId + " deleted Review ID " + myRatingsAndReviews.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when delete id rating and review");
                return StatusCode(500);
            }
        }

        [HttpDelete("admin/{id}"), Authorize(Roles = "admin")]
        public IActionResult DeleteRatingsAndReviewsAdmin(int id)
        {
            try
            {
                var myRatingsAndReviews = _context.RatingsAndReviews.Find(id);
                if (myRatingsAndReviews == null)
                {
                    return NotFound();
                }

                _context.RatingsAndReviews.Remove(myRatingsAndReviews);
                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(myRatingsAndReviews.UserId.ToString(), "Admin deleted Review ID " + myRatingsAndReviews.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when delete id rating and review ADMIN");
                return StatusCode(500);
            }
        }
    }
}
