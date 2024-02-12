using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;
using AutoMapper;

namespace Enterprise_Development_Project_Assignment.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class PaymentsController : ControllerBase
	{
		private readonly MyDbContext _context;
		private readonly IConfiguration _configuration;
		private readonly IMapper _mapper;
		public PaymentsController(MyDbContext context, IConfiguration configuration, IMapper mapper)
		{
			_context = context;
			_configuration = configuration;
			_mapper = mapper;
		}
	}
}
