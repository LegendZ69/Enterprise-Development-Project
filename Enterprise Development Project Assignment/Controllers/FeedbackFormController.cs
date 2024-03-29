﻿using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using System.Text.Json.Serialization;
using System.Text.Json;
using Enterprise_Development_Project_Assignment.Helpers;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FeedbackFormController : ControllerBase
    {
        private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value).SingleOrDefault());
        }

        private readonly MyDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<FeedbackFormController> _logger;
        private readonly AuditLogHelper _auditLogHelper;

        public FeedbackFormController(MyDbContext context, IMapper mapper, ILogger<FeedbackFormController> logger, AuditLogHelper auditLogHelper)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _auditLogHelper = auditLogHelper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<FeedbackFormDTO>), StatusCodes.Status200OK)]
        public IActionResult GetAll(string? search)
        {
            try
            {
                IQueryable<FeedbackForm> result = _context.FeedbackForms.Include(t => t.User); //to be able to get user item
                if (search != null)
                {
                    result = result.Where(x => x.Email.Contains(search)
                    || x.FirstName.Contains(search)
                    || x.LastName.Contains(search)
                    || x.Topic.Contains(search)
                    || x.Message.Contains(search)
                    );
                }
                var list = result.OrderByDescending(x => x.CreatedAt).ToList();
                IEnumerable<FeedbackFormDTO> data = list.Select(t => _mapper.Map<FeedbackFormDTO>(t));
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when get all feedback forms");
                return StatusCode(500);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(FeedbackFormDTO), StatusCodes.Status200OK)]
        public IActionResult GetFeedbackForm(int id)
        {
            try
            {
                FeedbackForm? feedbackForm = _context.FeedbackForms.Include(t => t.User).FirstOrDefault(t => t.Id == id);
                if (feedbackForm == null)
                {
                    return NotFound();
                }
                FeedbackFormDTO data = _mapper.Map<FeedbackFormDTO>(feedbackForm);
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when get id feedback form");
                return StatusCode(500);
            }
        }

        [HttpPost, Authorize] //only authorised user can add / bind form to userid
        [ProducesResponseType(typeof(FeedbackFormDTO), StatusCodes.Status200OK)]
        public IActionResult AddFeedbackForm(AddFeedbackRequest feedbackForm)
        {
            try
            {
                int userId = GetUserId();
                var now = DateTime.Now;
                var myFeedbackForm = new FeedbackForm()
                {
                    //only can trim string
                    Email = feedbackForm.Email.Trim().ToLower(),
                    FirstName = feedbackForm.FirstName.Trim(),
                    LastName = feedbackForm.LastName.Trim(),
                    Topic = feedbackForm.Topic,
                    Message = feedbackForm.Message.Trim(),
                    CreatedAt = now,
                    UpdatedAt = now,
                    UserId = userId
                };

                _context.FeedbackForms.Add(myFeedbackForm);
                _context.SaveChanges();

                FeedbackForm? newFeedbackForm = _context.FeedbackForms.Include(t => t.User)
                    .FirstOrDefault(t => t.Id == myFeedbackForm.Id);
                FeedbackFormDTO feedbackFormDTO = _mapper.Map<FeedbackFormDTO>(newFeedbackForm);
                _auditLogHelper.LogUserActivityAsync(myFeedbackForm.UserId.ToString(), "User ID " + myFeedbackForm.UserId + " posted Feedback ID " + myFeedbackForm.Id).Wait();
                return Ok(feedbackFormDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when post feedback form");
                return StatusCode(500);
            }
        }

        [HttpPut("{id}"), Authorize(Roles = "user")]
        public IActionResult UpdateFeedbackForm(int id, UpdateFeedbackRequest feedbackForm)
        {
            try
            {
                var myFeedbackForm = _context.FeedbackForms.Find(id);
                if (myFeedbackForm == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (myFeedbackForm.UserId != userId)
                {
                    return Forbid();
                }

                if (feedbackForm.Email != null)
                {
                    myFeedbackForm.Email = feedbackForm.Email.Trim().ToLower();
                }
                if (feedbackForm.FirstName != null)
                {
                    myFeedbackForm.FirstName = feedbackForm.FirstName.Trim();
                }
                if (feedbackForm.LastName != null)
                {
                    myFeedbackForm.LastName = feedbackForm.LastName.Trim();
                }
                if (feedbackForm.Topic != null)
                {
                    myFeedbackForm.Topic = feedbackForm.Topic.Trim();
                }
                if (feedbackForm.Message != null)
                {
                    myFeedbackForm.Message = feedbackForm.Message.Trim();
                }
                myFeedbackForm.UpdatedAt = DateTime.Now;

                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(myFeedbackForm.UserId.ToString(), "User ID " + myFeedbackForm.UserId + " updated Feedback ID " + myFeedbackForm.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when put id feedback form");
                return StatusCode(500);
            }
        }

        [HttpPut("admin/{id}"), Authorize(Roles = "admin")]
        public IActionResult UpdateFeedbackFormAdmin(int id, UpdateFeedbackRequest feedbackForm)
        {
            try
            {
                var myFeedbackForm = _context.FeedbackForms.Find(id);
                if (myFeedbackForm == null)
                {
                    return NotFound();
                }

                if (feedbackForm.StaffRemark != null)
                {
                    myFeedbackForm.StaffRemark = feedbackForm.StaffRemark.Trim();
                }
                myFeedbackForm.UpdatedAt = DateTime.Now;

                _context.SaveChanges(); _auditLogHelper.LogUserActivityAsync(myFeedbackForm.UserId.ToString(), "Admin left staff remark on Feedback ID " + myFeedbackForm.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when put id feedback form ADMIN");
                return StatusCode(500);
            }
        }

        [HttpDelete("{id}"), Authorize(Roles = "user")]
        public IActionResult DeleteFeedbackForm(int id)
        {
            try
            {
                var myFeedbackForm = _context.FeedbackForms.Find(id);
                if (myFeedbackForm == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (myFeedbackForm.UserId != userId)
                {
                    return Forbid();
                }

                _context.FeedbackForms.Remove(myFeedbackForm);
                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(myFeedbackForm.UserId.ToString(), "User ID " + myFeedbackForm.UserId + " deleted Feedback ID " + myFeedbackForm.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when delete id feedback form");
                return StatusCode(500);
            }
        }

        [HttpDelete("admin/{id}"), Authorize(Roles = "admin")]
        public IActionResult DeleteFeedbackFormAdmin(int id)
        {
            try
            {
                var myFeedbackForm = _context.FeedbackForms.Find(id);
                if (myFeedbackForm == null)
                {
                    return NotFound();
                }

                _context.FeedbackForms.Remove(myFeedbackForm);
                _context.SaveChanges();
                _auditLogHelper.LogUserActivityAsync(myFeedbackForm.UserId.ToString(), "Admin deleted Feedback ID " + myFeedbackForm.Id).Wait();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when delete id feedback form ADMIN");
                return StatusCode(500);
            }
        }
    }
}
