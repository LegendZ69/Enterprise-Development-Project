using Enterprise_Development_Project_Assignment.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly ILogger<UserController> _logger;

        public UserController(MyDbContext context, IConfiguration configuration, IMapper mapper,
            ILogger<UserController> logger)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            try
            {
                // Trim string values
                request.Name = request.Name.Trim();
                request.Email = request.Email.Trim().ToLower();
                request.Password = request.Password.Trim();

                // Check email
                var foundUser = _context.Users.Where(x => x.Email == request.Email).FirstOrDefault();
                if (foundUser != null)
                {
                    string message = "Email already exists.";
                    return BadRequest(new { message });
                }

                // Determine user role based on email
                string role = request.Email.EndsWith("@admin.com") ? "admin" : "user";


                // Create user object
                var now = DateTime.Now;
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                var user = new User()
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = passwordHash,
                    CreatedAt = now,
                    UpdatedAt = now,
                    Role = role
                };

                // Add user
                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when user register");
                return StatusCode(500);
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        public IActionResult Login(LoginRequest request)
        {
            try
            {
                // Trim string values
                request.Email = request.Email.Trim().ToLower();
                request.Password = request.Password.Trim();

                // Check email and password
                string message = "Email or password is not correct.";
                var foundUser = _context.Users.Where(x => x.Email == request.Email).FirstOrDefault();
                if (foundUser == null)
                {
                    return BadRequest(new { message });
                }
                bool verified = BCrypt.Net.BCrypt.Verify(request.Password, foundUser.Password);
                if (!verified)
                {
                    return BadRequest(new { message });
                }

                // Return user info
                UserDTO userDTO = _mapper.Map<UserDTO>(foundUser);
                string accessToken = CreateToken(foundUser);
                LoginResponse response = new() { User = userDTO, AccessToken = accessToken };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when user login");
                return StatusCode(500);
            }
        }
        [HttpGet("auth"), Authorize]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        public IActionResult Auth()
        {
            try
            {
                var idClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                var nameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
                var emailClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
                var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);

                if (idClaim != null && nameClaim != null && emailClaim != null)
                {
                    int id = Convert.ToInt32(idClaim.Value);
                    string name = nameClaim.Value;
                    string email = emailClaim.Value;
                    string role = roleClaim?.Value ?? "user";

                    UserDTO userDTO = new()
                    {
                        Id = id,
                        Name = name,
                        Email = email,
                        Role = role
                    };

                    AuthResponse response = new() { User = userDTO };
                    return Ok(response);
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when user auth");
                return StatusCode(500, new { error = "Internal Server Error" });
            }
        }


        private string CreateToken(User user)
        {
            string secret = _configuration.GetValue<string>("Authentication:Secret");
            int tokenExpiresDays = _configuration.GetValue<int>("Authentication:TokenExpiresDays");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Name),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(tokenExpiresDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            string token = tokenHandler.WriteToken(securityToken);

            return token;
        }
        [HttpGet("users")]
        [ProducesResponseType(typeof(IEnumerable<UserDTO>), StatusCodes.Status200OK)]
        public IActionResult GetAllUsers(string? search)
        {
            try
            {
                IQueryable<User> result = _context.Users;
                if (search != null)
                {
                    result = result.Where(x => x.Name.Contains(search) || x.Email.Contains(search));
                }

                var list = result.OrderByDescending(x => x.CreatedAt).ToList();
                IEnumerable<UserDTO> data = list.Select(u => _mapper.Map<UserDTO>(u));
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when get all users");
                return StatusCode(500);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
        public IActionResult GetUser(int id)
        {
            try
            {
                User? user = _context.Users.FirstOrDefault(u => u.Id == id);
                if (user == null)
                {
                    return NotFound();
                }

                UserDTO data = _mapper.Map<UserDTO>(user);
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when getting user by id");
                return StatusCode(500);
            }
        }

        [HttpPut("{id}"), Authorize]
        public IActionResult UpdateUser(int id, UpdateUserRequest userUpdate)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    return NotFound();
                }



                if (userUpdate.Name != null)
                {
                    user.Name = userUpdate.Name.Trim();
                }
                if (userUpdate.Email != null)
                {
                    string newEmail = userUpdate.Email.Trim().ToLower();

                    var existingUser = _context.Users.FirstOrDefault(u => u.Email == newEmail && u.Id != id);
                    if (existingUser != null)
                    {
                        string message = "Email already exists for another user.";
                        return BadRequest(new { message });
                    }

                    user.Email = newEmail;

                    // Check if the updated email includes "@admin.com" and update the role
                    user.Role = newEmail.EndsWith("@admin.com") ? "admin" : "user";
                }
                if (userUpdate.ImageFile != null)
                {
                    user.ImageFile = userUpdate.ImageFile;
                }
                if (userUpdate.PhoneNumber != null)
                {
                    user.PhoneNumber = userUpdate.PhoneNumber.Trim().ToLower();
                }

                user.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when updating user");
                return StatusCode(500);
            }
        }
        [HttpDelete("{id}"), Authorize]

        public IActionResult DeleteUser(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    return NotFound();
                }

                _context.Users.Remove(user);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when deleting user");
                return StatusCode(500);
            }
        }
        [HttpPut("changepassword"), Authorize]
        public IActionResult ChangePassword(int id, ChangePasswordRequest changePasswordRequest)
        {
            try
            {
                // Trim string values
                changePasswordRequest.CurrentPassword = changePasswordRequest.CurrentPassword.Trim();
                changePasswordRequest.NewPassword = changePasswordRequest.NewPassword.Trim();
                changePasswordRequest.ConfirmPassword = changePasswordRequest.ConfirmPassword.Trim();

                // Retrieve user based on the authenticated user
                int userId = id;
                var user = _context.Users.Find(userId);
                if (user == null)
                {
                    return NotFound();
                }
                // Log the received data
                _logger.LogInformation($"Received data - Id: {id}, CurrentPassword: {changePasswordRequest.CurrentPassword}, NewPassword: {changePasswordRequest.NewPassword}");
                // Verify the current password
                bool currentPasswordVerified = BCrypt.Net.BCrypt.Verify(changePasswordRequest.CurrentPassword, user.Password);
                if (!currentPasswordVerified)
                {
                    string message = "Current password is incorrect.";
                    return BadRequest(new { message });
                }
                // Check if the new password is the same as the current password
                if (changePasswordRequest.CurrentPassword == changePasswordRequest.NewPassword)
                {
                    string message = "New password must be different from the current password.";
                    return BadRequest(new { message });
                }
                // Update the password with the new one
                user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordRequest.NewPassword);
                user.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when changing password");
                return StatusCode(500);
            }
        }


    }
}
