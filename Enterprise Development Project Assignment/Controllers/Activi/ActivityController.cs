using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Enterprise_Development_Project_Assignment.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Newtonsoft.Json;
using Azure.Core;
using Enterprise_Development_Project_Assignment.Models.Activi;


namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ActivityController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpClientFactory _httpClientFactory;

        public ActivityController(MyDbContext context, IMapper mapper, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _mapper = mapper;
            _httpClientFactory = httpClientFactory;
        }

        private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
            .Where(c => c.Type == ClaimTypes.NameIdentifier)
            .Select(c => c.Value).SingleOrDefault());
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ActivityDTO>), StatusCodes.Status200OK)]
        public IActionResult GetAll(string? search, DateTime? date)
        {
            IQueryable<Activity> result = _context.Activities.Include(a => a.User);

            if (search != null)
            {
                result = result.Where(x => x.Title.Contains(search) || x.Description.Contains(search));
            }

            if (date.HasValue)
            {
                // Filter activities based on the selected date
                result = result.Where(x => x.EventDate.Date == date.Value.Date);
            }

            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            IEnumerable<ActivityDTO> data = list.Select(a => _mapper.Map<ActivityDTO>(a));
            return Ok(data);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(typeof(ActivityDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> AddActivity(AddActivityRequests activity)
        {
            int userId = GetUserId();
            var now = DateTime.Now;

            if (!User.IsInRole("admin"))
            {
                return Forbid("You do not have permission to perform this action.");
            }

            // Use Google Maps Geocoding API to fetch latitude and longitude
            var coordinates = await GetCoordinatesFromAddress(activity.Location);
            if (coordinates == null)
            {
                return BadRequest("Invalid location.");
            }

            // Add 1 day to the event date
            activity.EventDate = activity.EventDate.AddDays(1);

            var myActivity = new Activity()
            {
                Title = activity.Title.Trim(),
                Description = activity.Description.Trim(),
                ImageFile = activity.ImageFile,
                Price = activity.Price,
                Category = activity.Category,
                EventDate = activity.EventDate,
                Location = activity.Location,
                Latitude = coordinates.Latitude,
                Longitude = coordinates.Longitude,
                CreatedAt = now,
                UpdatedAt = now,
                UserId = userId
            };

            _context.Activities.Add(myActivity);
            _context.SaveChanges();

            foreach (var timeslotDTO in activity.Timeslots)
            {
                var timeslot = new Timeslot
                {
                    StartTime = timeslotDTO.StartTime,
                    EndTime = timeslotDTO.EndTime,
                    ActivityId = myActivity.Id
                };

                _context.Timeslots.Add(timeslot);
            }

            await _context.SaveChangesAsync();

            Activity newActivity = _context.Activities.Include(t => t.User)
                .FirstOrDefault(t => t.Id == myActivity.Id);
            ActivityDTO activityDTO = _mapper.Map<ActivityDTO>(newActivity);
            return Ok(activityDTO);
        }


        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ActivityDTO), StatusCodes.Status200OK)]
        public IActionResult GetTutorial(int id)
        {
            Activity? activity = _context.Activities
                                            .Include(a => a.User)
                                            .Include(a => a.Timeslots) // Include Timeslots
                                            .FirstOrDefault(a => a.Id == id);
            if (activity == null)
            {
                return NotFound();
            }
            ActivityDTO data = _mapper.Map<ActivityDTO>(activity);
            return Ok(data);
        }



        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
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
            if (activity.EventDate != default)
            {
                myActivity.EventDate = activity.EventDate;
            }
            if (!string.IsNullOrEmpty(activity.Location))
            {
                myActivity.Location = activity.Location;
            }

            _context.SaveChanges();
            return Ok();
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult DeleteActivity(int id)
        {
            var activity = _context.Activities.Include(a => a.Bookings).FirstOrDefault(a => a.Id == id);
            if (activity == null)
            {
                return NotFound(); // Activity not found
            }

            // Delete related bookings
            _context.Bookings.RemoveRange(activity.Bookings);

            // Remove activity
            _context.Activities.Remove(activity);
            _context.SaveChanges();

            return NoContent(); // Successfully deleted
        }


        [HttpGet("category/{category}")]
        [ProducesResponseType(typeof(IEnumerable<ActivityDTO>), StatusCodes.Status200OK)]
        public IActionResult GetActivitiesByCategory(string category, string? search, DateTime? date)
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

            if (date.HasValue)
            {
                // Filter activities based on the selected date
                result = result.Where(x => x.EventDate.Date == date.Value.Date);
            }

            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            IEnumerable<ActivityDTO> data = list.Select(a => _mapper.Map<ActivityDTO>(a));
            return Ok(data);
        }

        //[HttpGet("location")]
        //[ProducesResponseType(typeof(IEnumerable<ActivityDTO>), StatusCodes.Status200OK)]
        //public IActionResult GetActivitiesByLocation(string location)
        //{
        //    IQueryable<Activity> result = _context.Activities.Include(a => a.User);

        //    switch (location.ToLower())
        //    {
        //        case "north":
        //            result = result.Where(x => x.Latitude > 1.49);  // Adjust latitude boundary for north
        //            break;
        //        case "south":
        //            result = result.Where(x => x.Latitude < 1.12);  // Adjust latitude boundary for south
        //            break;
        //        case "east":
        //            result = result.Where(x => x.Longitude > 103.43);  // Adjust longitude boundary for east
        //            break;
        //        case "west":
        //            result = result.Where(x => x.Longitude < 104.13);  // Adjust longitude boundary for west
        //            break;
        //        default:
        //            return BadRequest("Invalid location. Valid locations are: north, south, east, west.");
        //    }

        //    var list = result.OrderByDescending(x => x.CreatedAt).ToList();
        //    IEnumerable<ActivityDTO> data = list.Select(a => _mapper.Map<ActivityDTO>(a));
        //    return Ok(data);
        //}


        private async Task<CoordinatesDTO?> GetCoordinatesFromAddress(string address)
        {
            var apiKey = "AIzaSyC2JmVltw3KPXhgDgDg5Ir5NdOeDV_TZ_M";
            var httpClient = _httpClientFactory.CreateClient();

            try
            {
                var response = await httpClient.GetAsync($"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={apiKey}");
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<GeocodingResponse>(content);

                if (result != null && result.Results.Any())
                {
                    var location = result.Results.First().Geometry.Location;
                    return new CoordinatesDTO { Latitude = location.Lat, Longitude = location.Lng };
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                // Log or handle error
                Console.WriteLine(ex.Message);
                return null;
            }
        }


        public class GeocodingResponse
        {
            public GeocodingResult[] Results { get; set; }
        }

        public class GeocodingResult
        {
            public Geometry Geometry { get; set; }
        }

        public class Geometry
        {
            public Location Location { get; set; }
        }

        public class Location
        {
            public double Lat { get; set; }
            public double Lng { get; set; }
        }

        public class CoordinatesDTO
        {
            public double Latitude { get; set; }
            public double Longitude { get; set; }
        }

    }
}



