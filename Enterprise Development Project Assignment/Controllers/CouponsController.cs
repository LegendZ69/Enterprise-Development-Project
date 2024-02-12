using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Enterprise_Development_Project_Assignment.Helpers;
using Microsoft.Extensions.Logging;

namespace Enterprise_Development_Project_Assignment.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class CouponsController : ControllerBase
	{
		private readonly MyDbContext _context;
		private readonly IConfiguration _configuration;
		private readonly IMapper _mapper;
		private readonly ILogger<UserController> _logger;
		private readonly AuditLogHelper _auditLogHelper;
		public CouponsController(MyDbContext context, IConfiguration configuration, IMapper mapper, ILogger<UserController> logger, AuditLogHelper auditLogHelper)
		{
			_context = context;
			_configuration = configuration;
			_mapper = mapper;
			_logger = logger;
			_auditLogHelper = auditLogHelper;

		}
		[HttpGet]
		[ProducesResponseType(typeof(IEnumerable<CouponsDTO>), StatusCodes.Status200OK)]
		public IActionResult GetAll()
		{
			IQueryable<Coupons> result = _context.Coupons;
			var list = result.OrderByDescending(x => x.CreatedAt).ToList();
			IEnumerable<CouponsDTO> data = list.Select(t => _mapper.Map<CouponsDTO>(t));
			return Ok(list);
		}
		[HttpPost]
		[ProducesResponseType(typeof(CouponsDTO), StatusCodes.Status200OK)]
		public IActionResult AddCoupon(AddCouponsRequests coupons)
		{
			var now = DateTime.Now;

			if (_context.Coupons.Any(c => c.CouponName == coupons.CouponName))
			{
				return BadRequest("Coupon with the same name already exists.");
			}

			var myCoupon = new Coupons()
			{

				CouponName = coupons.CouponName.Trim(),
				Discount = coupons.Discount,
				Usage = coupons.Usage,
				Valid = coupons.Valid,
				CouponStatus = coupons.CouponStatus.Trim(),
				CreatedAt = now,
				UpdatedAt = now,

			};
			_context.Coupons.Add(myCoupon);
			_context.SaveChanges();
			
			Coupons? newCoupon = _context.Coupons.FirstOrDefault(t => t.Id == myCoupon.Id);
			CouponsDTO couponsDTO = _mapper.Map<CouponsDTO>(newCoupon);
			return Ok(couponsDTO);

		}

		[HttpPut("{id}")]
		public IActionResult UpdateCoupon(int id, UpdateCoupons coupons)
		{
			var myCoupon = _context.Coupons.Find(id);
			if (myCoupon == null)
			{
				return NotFound();
			}
			if (coupons.CouponName != null && coupons.CouponName.Trim() != myCoupon.CouponName &&
		_context.Coupons.Any(c => c.CouponName == coupons.CouponName.Trim()))
			{
				return BadRequest("Coupon with the updated name already exists.");
			}
			if (coupons.CouponName != null)
			{
				myCoupon.CouponName = coupons.CouponName.Trim();
			}
			if (coupons.Discount != null)
			{
				myCoupon.Discount = (decimal)coupons.Discount;
			}
			if (coupons.Usage != null)
			{
				myCoupon.Usage = (int)coupons.Usage;
			}
			if (coupons.Valid != null)
			{
				myCoupon.Valid = coupons.Valid.Value;
			}
			if (coupons.CouponStatus != null)
			{
				myCoupon.CouponStatus = coupons.CouponStatus.Trim();
			}


			_context.SaveChanges();
			return Ok();

		}

		[HttpDelete("{id}")]
		public IActionResult DeleteCoupons(int id)
		{
			var myCoupon = _context.Coupons.Find(id);
			if (myCoupon == null)
			{
				return NotFound();
			}
			_context.Coupons.Remove(myCoupon);
			_context.SaveChanges();
			return Ok();
		}
		[HttpGet("CheckDuplicateCouponName")]
		public IActionResult CheckDuplicateCouponName(string couponName)
		{
			bool isDuplicate = _context.Coupons.Any(c => c.CouponName == couponName.Trim());
			return Ok(new { isDuplicate });
		}
	}

}