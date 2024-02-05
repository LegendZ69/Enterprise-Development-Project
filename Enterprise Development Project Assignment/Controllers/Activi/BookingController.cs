using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Enterprise_Development_Project_Assignment.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System;
using System.Linq;
using Enterprise_Development_Project_Assignment;

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

    [HttpPost("{id}"), Authorize]
    [ProducesResponseType(typeof(BookingDTO), StatusCodes.Status200OK)]
    public IActionResult BookActivity(int id, BookingActivityRequest request)
    {
        int userId = GetUserId();

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
            BookingDate = request.BookingDate
        };

        _context.Bookings.Add(booking);
        _context.SaveChanges();

        var bookingDTO = _mapper.Map<BookingDTO>(booking);
        return Ok(bookingDTO);
    }

    [HttpGet("{id}"), Authorize]
    [ProducesResponseType(typeof(BookingDTO), StatusCodes.Status200OK)]
    public IActionResult GetBooking(int id)
    {
        int userId = GetUserId();

        var booking = _context.Bookings
            .Include(b => b.Activity) // 
            .FirstOrDefault(b => b.Id == id && b.UserId == userId);

        if (booking == null)
        {
            return NotFound();
        }

        var bookingDTO = _mapper.Map<BookingDTO>(booking);

        // Set the ActivityName property
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
            ActivityTitle = booking.Activity.Title 
        }).ToList();

        return Ok(userBookingDTOs);
    }






}
