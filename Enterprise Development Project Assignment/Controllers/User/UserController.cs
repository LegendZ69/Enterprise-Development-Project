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
                    Status = "activated"
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

                // Check if two-factor authentication is enabled
                if (foundUser.TwoFactorEnabled)
                {
                    // Generate a random verification code
                    string verificationCode = GenerateVerificationCode();

                    // Save the verification code in the database
                    foundUser.VerificationCode = verificationCode;
                    _context.SaveChanges();

                    // Send the verification code to the user's email
                    SendVerificationCodeByEmail(foundUser.Email, verificationCode);

                    // Log sent verification code 
                    _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "Sent Verification Code").Wait();

                    // Return a response indicating that verification is required
                    return BadRequest(new { message = "Verification code sent. Please verify your identity." });
                }


                // Check if the account is activated
                if (foundUser.Status.ToLower() != "activated")
                {
                    // Check if the account is deactivated
                    if (foundUser.Status.ToLower() == "deactivated")
                    {
                        // Check if the deactivation period is over
                        if (foundUser.Deactivefully.HasValue && foundUser.Deactivefully.Value <= DateTime.Now)
                        {
                            // Delete the account
                            _context.Users.Remove(foundUser);
                            _context.SaveChanges();

                            // Log account deletion
                            _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "Deleted account due to deactivation period expiration").Wait();

                            return BadRequest(new { message = "Your account has been deleted due to inactivity. Please register again." });
                        }
                        else
                        {
                            // Account is deactivated but not yet expired, ask user if they want to reactivate
                            // You can implement a logic to handle user reactivation here
                            // For now, returning a message asking the user to contact support or something similar
                            return BadRequest(new { message = "Your account is deactivated. Please contact support to reactivate." });
                        }
                    }
                    else
                    {
                        // Account is neither activated nor deactivated
                        return BadRequest(new { message = "Your account is not activated. Please contact support for assistance." });
                    }
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

        private string GenerateVerificationCode()
        {
            // Generate a random 6-digit verification code
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        private void SendVerificationCodeByEmail(string userEmail, string verificationcode)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");

                mail.From = new MailAddress("your_email@gmail.com");
                mail.To.Add(userEmail);
                mail.Subject = "Verify Email";
                mail.Body = $"Your verification code is {verificationcode}";

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

        [HttpPost("verify")]
        public IActionResult Verify(VerifyRequest request)
        {
            try
            {
                // Trim string values
                request.Email = request.Email.Trim().ToLower();
                request.VerificationCode = request.VerificationCode.Trim();

                // Check if the user exists and verification code matches
                var foundUser = _context.Users.FirstOrDefault(x => x.Email == request.Email && x.VerificationCode == request.VerificationCode);
                if (foundUser == null)
                {
                    // Log failed verification attempt
                    _auditLogHelper.LogUserActivityAsync(request.Email, "Failed Verification: Invalid verification code").Wait();
                    return BadRequest("Invalid verification code or user not found.");
                }

                // Clear verification code
                foundUser.VerificationCode = "";
                _context.SaveChanges();

                // Log successful login
                _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "User logged in successfully with verification code").Wait();

                // Generate JWT token
                string accessToken = CreateToken(foundUser);

                // Return the token to the client
                return Ok(new { accessToken });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when verifying user");
                return StatusCode(StatusCodes.Status500InternalServerError);
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
                    result = result.Where(x =>
                    x.Name.Contains(search) ||
                    x.Email.Contains(search) ||
                    x.Id.ToString().Contains(search) || // Assuming Id is numeric
                    x.Role.Contains(search) ||
                    x.Status.Contains(search));

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

                }
                if (userUpdate.ImageFile != null)
                {
                    user.ImageFile = userUpdate.ImageFile;
                }
                if (userUpdate.PhoneNumber != null)
                {
                    user.PhoneNumber = userUpdate.PhoneNumber.Trim().ToLower();
                }
                if (userUpdate.Status != null)
                {
                    user.Status = userUpdate.Status.Trim().ToLower();
                    if (user.Status == "deactivated")
                    {
                        user.Deactivefully = DateTime.Now.AddDays(5);
                    }
                }
                if (userUpdate.TwoFactorEnabled != null)
                {
                    user.TwoFactorEnabled = userUpdate.TwoFactorEnabled;
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



        [HttpPost("reactivate-account")]
        public IActionResult ReactivateAccount(ReactivateRequest request)
        {
            try
            {
                // Trim string values
                request.Email = request.Email.Trim().ToLower();
                request.Password = request.Password.Trim();

                // Check if the user exists
                var foundUser = _context.Users.FirstOrDefault(x => x.Email == request.Email);
                if (foundUser == null)
                {
                    // Log failed reactivation attempt
                    _auditLogHelper.LogUserActivityAsync(request.Email, "Failed Reactivation: User not found").Wait();
                    return BadRequest("User not found");
                }

                // Check if the user is deactivated
                if (foundUser.Status.ToLower() != "deactivated")
                {
                    // Log failed reactivation attempt
                    _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "Failed Reactivation: User is not deactivated").Wait();
                    return BadRequest("User is not deactivated");
                }

                // Check if the deactivation period is over
                if (foundUser.Deactivefully.HasValue && foundUser.Deactivefully.Value < DateTime.Now)
                {
                    // Log failed reactivation attempt
                    _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "Failed Reactivation: Deactivation period is over").Wait();
                    return BadRequest("Deactivation period is over");
                }

                // Verify the password
                bool verified = BCrypt.Net.BCrypt.Verify(request.Password, foundUser.Password);
                if (!verified)
                {
                    // Log failed reactivation attempt
                    _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "Failed Reactivation: Incorrect password").Wait();
                    return BadRequest("Incorrect password");
                }

                // Reactivate the account
                foundUser.Status = "activated";
                foundUser.Deactivefully = null; // Reset deactivation period

                // Save changes to the database
                _context.SaveChanges();

                // Log successful reactivation
                _auditLogHelper.LogUserActivityAsync(foundUser.Id.ToString(), "User account reactivated").Wait();

                return Ok("Account reactivated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when reactivating account");
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
                        Role = role,
                        Status = "activated",
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
