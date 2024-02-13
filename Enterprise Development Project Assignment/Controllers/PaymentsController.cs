using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;
using AutoMapper;
using System.Security.Claims;
using Enterprise_Development_Project_Assignment.Helpers;

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
		private int GetUserId()
		{

			return Convert.ToInt32(User.Claims
			.Where(c => c.Type == ClaimTypes.NameIdentifier)
			.Select(c => c.Value).SingleOrDefault());
		}
		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<PaymentDTO>), StatusCodes.Status200OK)]
		public IActionResult GetAll()
		{
			IQueryable<Payment> result = _context.Payments;
			var list = result.OrderByDescending(x => x.CreatedAt).ToList();
			IEnumerable<PaymentDTO> data = list.Select(t => _mapper.Map<PaymentDTO>(t));
			return Ok(list);
		}

		[HttpPost]
		[ProducesResponseType(typeof(PaymentDTO), StatusCodes.Status200OK)]
		public IActionResult AddPayment(AddPaymentRequest payment)
		{
			int userId = GetUserId();
			var now = DateTime.Now;

			var myPayment = new Payment()
			{

				Price = payment.Price,
				ActivityTitle = payment.ActivityTitle?.Trim(),
				BookedDate = payment.BookedDate?.Trim(),
				CreatedAt = now,
				UpdatedAt = now,
				UserId = userId

			};
			_context.Payments.Add(myPayment);
			_context.SaveChanges();

			Payment? newPayment = _context.Payments.FirstOrDefault(t => t.Id == myPayment.Id);
			PaymentDTO paymentDTO = _mapper.Map<PaymentDTO>(newPayment);
			return Ok(paymentDTO);

		}
		[HttpDelete("{id}")]
		public IActionResult DeletePayment(int id)
		{
			var myPayment = _context.Payments.Find(id);
			if (myPayment == null)
			{
				return NotFound();
			}
			_context.Payments.Remove(myPayment);
			_context.SaveChanges();
			return Ok();
		}
	}
}
