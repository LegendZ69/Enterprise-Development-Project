using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Enterprise_Development_Project_Assignment.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Enterprise_Development_Project_Assignment;
using System.Net.Mail;
using System.Net;

[ApiController]
[Route("[controller]")]
public class BookingController : ControllerBase
{
    private readonly MyDbContext _context;
    private readonly IMapper _mapper;

    public BookingController(MyDbContext context, IMapper mapper)
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

    private string GetUserEmail()
    {
        var userEmailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);

        if (userEmailClaim != null)
        {
            return userEmailClaim.Value;
        }

        throw new ApplicationException("Email claim not found for the current user.");
    }

    [HttpPost("{id}"), Authorize]
    [ProducesResponseType(typeof(BookingDTO), StatusCodes.Status200OK)]
    public IActionResult BookActivity(int id, BookingActivityRequest request)
    {
        int userId = GetUserId();
        string userEmail = GetUserEmail();

        // Retrieve the activity details
        var activity = _context.Activities.FirstOrDefault(a => a.Id == id);

        if (activity == null)
        {
            return NotFound("Activity not found");
        }

        // Check if the requested booking date is the allowed date for the activity
        if (activity.EventDate != request.BookingDate)
        {
            string message = "Booking is not allowed for the selected date.";
            return BadRequest(new { message });
        }

        // Check if the user has already booked this activity on the same date
        var existingBooking = _context.Bookings
            .FirstOrDefault(b => b.ActivityId == id && b.UserId == userId && b.BookingDate == request.BookingDate);

        if (existingBooking != null)
        {
            string message = "You have already booked this activity on the selected date.";
            return BadRequest(new { message });
        }

        var booking = new Booking
        {
            ActivityId = id,
            UserId = userId,
            BookingDate = request.BookingDate,
            Quantity = request.Quantity,
            SelectedTimeSlot = request.SelectedTimeSlot 
        };

        _context.Bookings.Add(booking);
        _context.SaveChanges();

        var bookingDTO = _mapper.Map<BookingDTO>(booking);
        SendBookingConfirmationEmail(userEmail, activity.Title, request.BookingDate);
        return Ok(bookingDTO);
    }

    [HttpGet("{id}"), Authorize]
    [ProducesResponseType(typeof(BookingDTO), StatusCodes.Status200OK)]
    public IActionResult GetBooking(int id)
    {
        int userId = GetUserId();

        var booking = _context.Bookings
            .Include(b => b.Activity)
            .FirstOrDefault(b => b.Id == id && b.UserId == userId);

        if (booking == null)
        {
            return NotFound();
        }

        var bookingDTO = _mapper.Map<BookingDTO>(booking);
        bookingDTO.ActivityTitle = booking.Activity.Title;

        return Ok(bookingDTO);
    }

    [HttpGet("userBookings"), Authorize]
    [ProducesResponseType(typeof(List<BookingDTO>), StatusCodes.Status200OK)]
    public IActionResult GetUserBookings()
    {
        int userId = GetUserId();

        var userBookings = _context.Bookings
            .Include(b => b.Activity)
            .Where(b => b.UserId == userId)
            .ToList();

        var userBookingDTOs = userBookings.Select(booking => new BookingDTO
        {
            Id = booking.Id,
            ActivityId = booking.ActivityId,
            UserId = booking.UserId,
            BookingDate = booking.BookingDate,
            User = _mapper.Map<UserBasicDTO>(booking.User),
            Quantity = booking.Quantity,
            ActivityTitle = booking.Activity.Title,
            Price = booking.Activity.Price * booking.Quantity
        }).ToList();

        return Ok(userBookingDTOs);
    }

    [HttpGet("adminBookings")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(List<BookingDTO>), StatusCodes.Status200OK)]
    public IActionResult GetAdminBookings()
    {
        var adminBookings = _context.Bookings
            .Include(b => b.Activity)
            .Include(b => b.User)
            .ToList();

        var adminBookingDTOs = adminBookings.Select(booking => new BookingDTO
        {
            Id = booking.Id,
            ActivityId = booking.ActivityId,
            UserId = booking.UserId,
            BookingDate = booking.BookingDate,
            User = _mapper.Map<UserBasicDTO>(booking.User),
            Quantity = booking.Quantity,
            ActivityTitle = booking.Activity.Title,
            Price = booking.Activity.Price * booking.Quantity
        }).ToList();

        return Ok(adminBookingDTOs);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteBooking(int id)
    {
        var booking = _context.Bookings.FirstOrDefault(b => b.Id == id);

        if (booking == null)
        {
            return NotFound();
        }

        _context.Bookings.Remove(booking);
        _context.SaveChanges();

        return NoContent();
    }


    private void SendBookingConfirmationEmail(string userEmail, string activityTitle, DateTime bookingDate)
    {
        using (MailMessage mail = new MailMessage())
        {
            using (SmtpClient smtpClient = new SmtpClient("smtp.gmail.com"))
            {
                mail.From = new MailAddress("your_email@gmail.com"); // Replace with your Gmail address
                mail.To.Add(userEmail);
                mail.Subject = "Booking Confirmation";
                mail.Body = $"Thank you for booking {activityTitle} on {bookingDate}.";

                smtpClient.Port = 587;
                smtpClient.Credentials = new NetworkCredential("ouchueyangschool@gmail.com", "ddzq bazy zmlu nzsy\r\n"); // Replace with your Gmail address and password
                smtpClient.EnableSsl = true;

                smtpClient.Send(mail);
            }
        }
    }
}
