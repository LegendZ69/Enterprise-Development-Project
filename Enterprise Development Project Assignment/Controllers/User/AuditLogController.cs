using AutoMapper;
using Enterprise_Development_Project_Assignment.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "admin")] // Ensure only admin can access audit logs
    public class AuditLogController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly ILogger<AuditLogController> _logger;
        private readonly IMapper _mapper;


        public AuditLogController(MyDbContext context, ILogger<AuditLogController> logger, IMapper mapper)
        {
            _context = context;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AuditLogDTO>),StatusCodes.Status200OK)]    
        public IActionResult GetAuditLogs(string? search)
        {
            try
            {
                IQueryable<AuditLog> result = _context.AuditLogs;
                if(search != null)
                {
                    result = result.Where(x => x.Action.Contains(search) || x.UserId.Contains(search));
                }
                var list = result.OrderByDescending(x => x.Timestamp).ToList();
                IEnumerable<AuditLogDTO> data = list.Select(u => _mapper.Map<AuditLogDTO>(u));
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error when retrieving audit logs");
                return StatusCode(500);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(AuditLogDTO), StatusCodes.Status200OK)]
        public IActionResult GetAuditLogById(int id)
        {
            {
                try
                {
                    AuditLog? auditlog = _context.AuditLogs.FirstOrDefault(u => u.Id == id);
                    if (auditlog == null)
                    {
                        return NotFound();
                    }

                    AuditLogDTO data = _mapper.Map<AuditLogDTO>(auditlog);
                    return Ok(data);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error when getting user by id");
                    return StatusCode(500);
                }
            }
        }

    }
}