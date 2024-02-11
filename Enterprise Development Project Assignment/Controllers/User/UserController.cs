using Enterprise_Development_Project_Assignment.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Enterprise_Development_Project_Assignment.Helpers;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;

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
        private readonly AuditLogHelper _auditLogHelper;

        public UserController(MyDbContext context, IConfiguration configuration, IMapper mapper,
            ILogger<UserController> logger,AuditLogHelper auditLogHelper)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
            _logger = logger;
            _auditLogHelper = auditLogHelper;
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
                request.PhoneNumber = request.PhoneNumber.Trim();

                // Check email
                var foundUser = _context.Users.Where(x => x.Email == request.Email).FirstOrDefault();
                if (foundUser != null)
                {
                    string message = "Email already exists.";
                    return BadRequest(new { message });
                }

                // Determine user role based on email
                string role = request.Email.Equals("test@admin.com", StringComparison.OrdinalIgnoreCase) ? "admin" : "user";


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
                    Role = role,
                    PhoneNumber =request.PhoneNumber,
                };

                // Add user
                _context.Users.Add(user);
                _context.SaveChanges();

                _auditLogHelper.LogUserActivityAsync(user.Id.ToString(), "User registered").Wait();

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
                    // Log failed login attempt
                    _auditLogHelper.LogUserActivityAsync(request.Email, "Failed Login: User not found").Wait();
                    return BadRequest(new { message });
                }
                bool verified = BCrypt.Net.BCrypt.Verify(request.Password, foundUser.Password);
                if (!verified)
                {
                    // Log failed login attempt
                    _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "Failed Login: Wrong Password").Wait();
                    return BadRequest(new { message });
                }

                // Log successful login
                _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "User logged in successfully").Wait();
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

        private string CreateRandomToken()
        {
            return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
        }


        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword(ForgetPasswordRequest request)
        {
            try
            {
                request.Email = request.Email.Trim().ToLower();
                string message = "User Not Found.";
                var foundUser = _context.Users.FirstOrDefault(x => x.Email == request.Email);
                if (foundUser == null)
                {
                    // Log failed forget password attempt
                    _auditLogHelper.LogUserActivityAsync(request.Email, "Failed Forget Password: User not found").Wait();
                    return BadRequest(new { message });
                }

                // Generate a random token
                string resetToken = CreateRandomToken();

                // Set the PasswordResetToken and ResetTokenExpires for the found user
                foundUser.PasswordResetToken = resetToken;
                foundUser.ResetTokenExpires = DateTime.Now.AddMinutes(5);

                // Save changes to the database
                _context.SaveChanges();
                // Send email with reset link
                SendResetPasswordEmail(foundUser.Email, resetToken);
                // Log the successful forget password attempt
                _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "Password reset token generated").Wait();

                return Ok("You may now reset your password");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error");
                return StatusCode(500);
            }
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword(ResetPasswordRequest request)
        {
            try
            {
                var foundUser = _context.Users.FirstOrDefault(x => x.PasswordResetToken == request.Token);
                if (foundUser == null|| foundUser.ResetTokenExpires < DateTime.Now)
                {
                    return BadRequest("Invalid Token");
                }

                // Verify the current password
                bool currentPasswordVerified = BCrypt.Net.BCrypt.Verify(request.NewPassword, foundUser.Password);
                if (currentPasswordVerified)
                {
                    string message = "New password cannot be same as old password.";
                    _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), $"Failed Reset Password: {message}").Wait();
                    return BadRequest(new { message });
                }

                // Update the password with the new one
                foundUser.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                foundUser.UpdatedAt = DateTime.Now;

                _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "Reset Password").Wait();
                // Save changes to the database
                _context.SaveChanges();


                return Ok("Password resetted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error");
                return StatusCode(500);
            }
        }


        private void SendResetPasswordEmail(string userEmail, string resetToken)
        {
            try
            {
                string siteUrl = _configuration["AppSettings:SiteUrl"];
                string resetUrl = $"http://localhost:3000/resetpassword?token={resetToken}";

                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");

                mail.From = new MailAddress("your_email@gmail.com");
                mail.To.Add(userEmail);
                mail.Subject = "Reset Your Password";
                mail.Body = $"Click the link below to reset your password:\n{resetUrl}";

                SmtpServer.Port = 587;
                SmtpServer.Credentials = new System.Net.NetworkCredential("ouchueyangschool@gmail.com", "ddzq bazy zmlu nzsy\r\n");
                SmtpServer.EnableSsl = true;

                SmtpServer.Send(mail);
            }
            catch (Exception ex)
            {
                // Log error
            }
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
                        _auditLogHelper.LogUserActivityAsync(user.Id.ToString(), $"Failed Update: {message}").Wait();
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

                _auditLogHelper.LogUserActivityAsync(user.Id.ToString(), "Updated user information").Wait(); ;

                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when updating user");
                return StatusCode(500);
            }
        }   
        [HttpDelete("{deleteid}/{deleterid}"), Authorize]
        public IActionResult DeleteUser(int deleteid, int deleterid)
        {
            try
            {
                // Check if the user making the request (deleter) exists
                var deleter = _context.Users.Find(deleterid);
                if (deleter == null)
                {
                    return NotFound("Deleter not found");
                }

                // Check if the user to be deleted (deleteid) exists
                var userToDelete = _context.Users.Find(deleteid);
                if (userToDelete == null)
                {
                    return NotFound("User to delete not found");
                }

                // You might want to check if the deleter has the necessary permissions here

                // Log the user activity
                _auditLogHelper.LogUserActivityAsync(deleter.Id.ToString(), $"User {userToDelete.Id} has been deleted").Wait();

                // Remove the user
                _context.Users.Remove(userToDelete);
                _context.SaveChanges();

                return Ok("User deleted successfully");
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
                    _auditLogHelper.LogUserActivityAsync(user.Id.ToString(), $"Failed Change Password: {message}").Wait();
                    return BadRequest(new { message });
                }
                // Check if the new password is the same as the current password
                if (changePasswordRequest.CurrentPassword == changePasswordRequest.NewPassword)
                {
                    string message = "New password must be different from the current password.";
                    _auditLogHelper.LogUserActivityAsync(user.Id.ToString(), $"Failed Change Password: {message}").Wait();
                    return BadRequest(new { message });
                }
                // Update the password with the new one
                user.Password = BCrypt.Net.BCrypt.HashPassword(changePasswordRequest.NewPassword);
                user.UpdatedAt = DateTime.Now;

                _auditLogHelper.LogUserActivityAsync(user.Id.ToString(), "Changed Password").Wait();
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when changing password");
                return StatusCode(500);
            }
        }

        [HttpPost("populateadminaccs"), Authorize]
        public IActionResult PopulateAdminAccs(int numberOfAccounts)
        {
            try
            {
                // Check if the authenticated user has the "admin" role
                var roleClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
                if (roleClaim == null || !roleClaim.Value.ToLower().Equals("admin"))
                {
                    return StatusCode(403, new { error = "You do not have authorization to perform this action." });
                }

                // Define a list to hold the admin accounts
                var adminAccounts = new List<RegisterRequest>();

                // Determine the starting index for the new admin accounts
                int startIndex = _context.Users.Count(u => u.Role.ToLower() == "admin") + 1;

                // Generate the specified number of admin accounts starting from the next index
                for (int i = startIndex; i < startIndex + numberOfAccounts; i++)
                {
                    string email = $"admin{i}@admin.com";
                    string name = $"Admin{i}";
                    string password = "Admin@1234567"; // You may want to generate unique passwords

                    // Add the admin account to the list
                    adminAccounts.Add(new RegisterRequest { Name = name, Email = email, Password = password });
                }

                foreach (var adminAccount in adminAccounts)
                {
                    // Trim and lowercase email
                    adminAccount.Email = adminAccount.Email.Trim().ToLower();

                    // Check if email already exists
                    var existingUser = _context.Users.FirstOrDefault(u => u.Email == adminAccount.Email);
                    if (existingUser != null)
                    {
                        // Skip if the email already exists
                        continue;
                    }

                    // Determine user role based on email
                    string role = "admin";

                    // Create user object
                    var now = DateTime.Now;
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(adminAccount.Password);
                    var user = new User()
                    {
                        Name = adminAccount.Name,
                        Email = adminAccount.Email,
                        Password = passwordHash,
                        CreatedAt = now,
                        UpdatedAt = now,
                        Role = role
                    };

                    // Add user
                    _context.Users.Add(user);
                }

                // Log the user activity
                var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                _auditLogHelper.LogUserActivityAsync(userId, $"Populated {numberOfAccounts} Admin Accounts").Wait();

                // Save changes after adding all admin accounts
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when adding admin accounts");
                return StatusCode(500);
            }
        }




    }
}
