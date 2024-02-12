using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;
using AutoMapper;
using System.Security.Claims;
using Enterprise_Development_Project_Assignment.Helpers;
using Microsoft.Extensions.Logging;

namespace Enterprise_Development_Project_Assignment.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class CreditCardController : ControllerBase
	{
		private readonly MyDbContext _context;
		private readonly IConfiguration _configuration;
		private readonly IMapper _mapper;
		private readonly ILogger<UserController> _logger;
		private readonly AuditLogHelper _auditLogHelper;
		public CreditCardController(MyDbContext context, IConfiguration configuration, IMapper mapper, ILogger<UserController> logger, AuditLogHelper auditLogHelper)
		{
			_context = context;
			_configuration = configuration;
			_mapper = mapper;
			_logger = logger;
			_auditLogHelper = auditLogHelper;

		}
		private int GetUserId()
		{

			return Convert.ToInt32(User.Claims
			.Where(c => c.Type == ClaimTypes.NameIdentifier)
			.Select(c => c.Value).SingleOrDefault());
		}
		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<CreditCardDTO>), StatusCodes.Status200OK)]
		public IActionResult GetAll()
		{
			IQueryable<CreditCard> result = _context.CreditCard;
			var list = result.OrderByDescending(x => x.CreatedAt).ToList();
			IEnumerable<CreditCardDTO> data = list.Select(t => _mapper.Map<CreditCardDTO>(t));

			return Ok(list);
		}

		[HttpPost]
		[ProducesResponseType(typeof(CreditCardDTO), StatusCodes.Status200OK)]
		public IActionResult AddCreditCard(AddCreditCardRequest creditCard)
		{
			int userId = GetUserId();
			var now = DateTime.Now;

			var myCreditCard = new CreditCard()
			{
				CardNumber = creditCard.CardNumber,
				FirstName = creditCard.FirstName,
				LastName = creditCard.LastName,
				City = creditCard.City,
				Address = creditCard.Address,
				CreatedAt = now,
				UpdatedAt = now,
				UserId = userId
			};
			_auditLogHelper.LogUserActivityAsync(GetUserId().ToString(), "User created credit card").Wait();
			_context.CreditCard.Add(myCreditCard);
			_context.SaveChanges();
			
			CreditCard? newCreditCard = _context.CreditCard.FirstOrDefault(t => t.Id == myCreditCard.Id);
			CreditCardDTO creditCardDTO = _mapper.Map<CreditCardDTO>(newCreditCard);
			return Ok(creditCardDTO);

		}
		[HttpPut("{id}")]
		public IActionResult UpdateCreditCard(int id, UpdateCreditCard creditCard)
		{
			var myCreditCard = _context.CreditCard.Find(id);
			if (myCreditCard == null)
			{
				return NotFound();
			}
			if (creditCard.CardNumber != null)
			{
				myCreditCard.CardNumber = creditCard.CardNumber.Trim();
			}
			if (creditCard.FirstName != null)
			{
				myCreditCard.FirstName = creditCard.FirstName.Trim();
			}
			if (creditCard.LastName != null)
			{
				myCreditCard.LastName = creditCard.LastName.Trim();
			}
			if (creditCard.City != null)
			{
				myCreditCard.City = creditCard.City.Trim();
			}
			if (creditCard.Address != null)
			{
				myCreditCard.Address = creditCard.Address.Trim();
			}
			_auditLogHelper.LogUserActivityAsync(GetUserId().ToString(), "User updated credit card").Wait();
			_context.SaveChanges();
			return Ok();

		}

		[HttpDelete("{id}")]
		public IActionResult DeleteCreditCard(int id)
		{
			var myCreditCard = _context.CreditCard.Find(id);
			if (myCreditCard == null)
			{
				return NotFound();
			}
			_auditLogHelper.LogUserActivityAsync(GetUserId().ToString(), "User deleted credit card").Wait();
			_context.CreditCard.Remove(myCreditCard);
			_context.SaveChanges();
			return Ok();
		}
	}
}