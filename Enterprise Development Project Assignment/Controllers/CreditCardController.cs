using Microsoft.AspNetCore.Mvc;
using Enterprise_Development_Project_Assignment.Models;
using AutoMapper;
namespace Enterprise_Development_Project_Assignment.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CreditCardController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public CreditCardController(MyDbContext context, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
        }
        [HttpGet]
        public IActionResult GetAll()
        {
            IQueryable<CreditCard> result = _context.CreditCard;
            var list = result.OrderByDescending(x => x.CreatedAt).ToList();
            return Ok(list);
        }

        [HttpPost]
        public IActionResult AddCreditCard(CreditCard creditCard)
        {
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
            };
            _context.CreditCard.Add(myCreditCard);
            _context.SaveChanges();
            return Ok(myCreditCard);
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
            _context.CreditCard.Remove(myCreditCard);
            _context.SaveChanges();
            return Ok();
        }
    }
}