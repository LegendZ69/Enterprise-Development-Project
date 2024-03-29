﻿using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;

//addons to link with User, create additional separate method for staff
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Enterprise_Development_Project_Assignment.Helpers;
using System.Diagnostics;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SuggestionFormController : ControllerBase
    {
        private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value).SingleOrDefault());
        }

        private readonly MyDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<SuggestionFormController> _logger;
        private readonly AuditLogHelper _auditLogHelper;

        public SuggestionFormController(MyDbContext context, IMapper mapper, ILogger<SuggestionFormController> logger, AuditLogHelper auditLogHelper)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _auditLogHelper = auditLogHelper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<SuggestionFormDTO>), StatusCodes.Status200OK)]
        public IActionResult GetAll(string? search)
        {
            try
            {
                IQueryable<SuggestionForm> result = _context.SuggestionForms.Include(t => t.User); //to include user object
                if (search != null)
                {
                    result = result.Where(x => x.Email.Contains(search)
                    || x.ActivityName.Contains(search)
    /*                || x.ActivityType.Contains(search)
    */                || x.ActivityDescription.Contains(search)
                    || x.ActivityReason.Contains(search)
                    );
                }
                var list = result.OrderByDescending(x => x.CreatedAt).ToList();
                IEnumerable<SuggestionFormDTO> data = list.Select(t => _mapper.Map<SuggestionFormDTO>(t));
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when get all suggestion forms");
                return StatusCode(500);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(SuggestionFormDTO), StatusCodes.Status200OK)]
        public IActionResult GetSuggestionForm(int id)
        {
            try
            {
                SuggestionForm? suggestionForm = _context.SuggestionForms.Include(t => t.User).FirstOrDefault(t => t.Id == id);
                if (suggestionForm == null)
                {
                    return NotFound();
                }
                SuggestionFormDTO data = _mapper.Map<SuggestionFormDTO>(suggestionForm);
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when get id suggestion form");
                return StatusCode(500);
            }
        }

        [HttpPost, Authorize] //only authorised user can add / bind form to userid
        [ProducesResponseType(typeof(SuggestionFormDTO), StatusCodes.Status200OK)]
        public IActionResult AddSuggestionForm(AddSuggestionRequest suggestionForm)
        {
            try
            {
                int userId = GetUserId();
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
                    UpdatedAt = now,
                    UserId = userId
                };

                _context.SuggestionForms.Add(mySuggestionForm);
                _context.SaveChanges();

                SuggestionForm? newSuggestionForm = _context.SuggestionForms.Include(t => t.User)
                    .FirstOrDefault(t => t.Id == mySuggestionForm.Id);
                SuggestionFormDTO suggestionFormDTO = _mapper.Map<SuggestionFormDTO>(newSuggestionForm);
                _auditLogHelper.LogUserActivityAsync(mySuggestionForm.UserId.ToString(), "User ID " + mySuggestionForm.UserId + " posted Suggestion ID " + mySuggestionForm.Id).Wait();
                return Ok(suggestionFormDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when post suggestion form");
                return StatusCode(500);
            }
        }

        [HttpPut("{id}"), Authorize(Roles = "user")] //only user can edit
        public IActionResult UpdateSuggestionForm(int id, UpdateSuggestionRequest suggestionForm)
        {
            try
            {
                var mySuggestionForm = _context.SuggestionForms.Find(id);
                if (mySuggestionForm == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (mySuggestionForm.UserId != userId)
                {
                    return Forbid();
                }

                if (suggestionForm.Email != null)
                {
                    mySuggestionForm.Email = suggestionForm.Email.Trim().ToLower();
                }
                if (suggestionForm.ActivityName != null)
                {
                    mySuggestionForm.ActivityName = suggestionForm.ActivityName.Trim();
                }
                if (suggestionForm.ActivityType != null)
                {
                    mySuggestionForm.ActivityType = suggestionForm.ActivityType.Trim();
                }
                if (suggestionForm.ActivityDescription != null)
                {
                    mySuggestionForm.ActivityDescription = suggestionForm.ActivityDescription.Trim();
                }
                if (suggestionForm.ActivityReason != null)
                {
                    mySuggestionForm.ActivityReason = suggestionForm.ActivityReason.Trim();
                }
                mySuggestionForm.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(mySuggestionForm.UserId.ToString(), "User ID " + mySuggestionForm.UserId + " updated Suggestion ID " + mySuggestionForm.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when put id suggestion form");
                return StatusCode(500);
            }
        }

        [HttpPut("admin/{id}"), Authorize(Roles = "admin")] //only admin can edit
        public IActionResult UpdateSuggestionFormAdmin(int id, UpdateSuggestionRequest suggestionForm)
        {
            try
            {
                var mySuggestionForm = _context.SuggestionForms.Find(id);
                if (mySuggestionForm == null)
                {
                    return NotFound();
                }

                if (suggestionForm.StaffRemark != null)
                {
                    mySuggestionForm.StaffRemark = suggestionForm.StaffRemark.Trim();
                }
                mySuggestionForm.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(mySuggestionForm.UserId.ToString(), "Admin left staff remark on Suggestion ID " + mySuggestionForm.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when put id suggestion form ADMIN");
                return StatusCode(500);
            }
        }

        [HttpDelete("{id}"), Authorize(Roles = "user")]
        public IActionResult DeleteSuggestionForm(int id)
        {
            try
            {
                var mySuggestionForm = _context.SuggestionForms.Find(id);
                var role = _context.Users.Find(id);
                if (mySuggestionForm == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (mySuggestionForm.UserId != userId)
                {
                    return Forbid();
                }

                _context.SuggestionForms.Remove(mySuggestionForm);
                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(mySuggestionForm.UserId.ToString(), "User ID " + mySuggestionForm.UserId + " deleted Suggestion ID " + mySuggestionForm.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when delete id suggestion form");
                return StatusCode(500);
            }
        }

        [HttpDelete("admin/{id}"), Authorize(Roles = "admin")]
        public IActionResult DeleteSuggestionFormAdmin(int id)
        {
            try
            {
                var mySuggestionForm = _context.SuggestionForms.Find(id);
                var role = _context.Users.Find(id);
                if (mySuggestionForm == null)
                {
                    return NotFound();
                }

                _context.SuggestionForms.Remove(mySuggestionForm);
                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(mySuggestionForm.UserId.ToString(), "Admin deleted Suggestion ID " + mySuggestionForm.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when delete id suggestion form ADMIN");
                return StatusCode(500);
            }
        }
    }
}
