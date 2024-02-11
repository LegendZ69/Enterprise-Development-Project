using AutoMapper;
using Enterprise_Development_Project_Assignment.Models;
using Enterprise_Development_Project_Assignment.Models.Activi;

namespace Enterprise_Development_Project_Assignment
{
	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			CreateMap<Activity, ActivityDTO>();
            CreateMap<User, UserBasicDTO>();
            CreateMap<User, UserDTO>();
            CreateMap<Booking, BookingDTO>();
            CreateMap<AuditLog,AuditLogDTO>();
            CreateMap<Timeslot, TimeslotDTO>();
			CreateMap<Coupons, CouponsDTO>();
		}
    }
}
