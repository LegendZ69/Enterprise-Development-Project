﻿using AutoMapper;
using Enterprise_Development_Project_Assignment.Models;

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

            CreateMap<FeedbackForm, FeedbackFormDTO>();
            CreateMap<SuggestionForm, SuggestionFormDTO>();
            CreateMap<RatingsAndReviews, RatingsAndReviewsDTO>();

            CreateMap<Coupons, CouponsDTO>();
            CreateMap<CreditCard, CreditCardDTO>();
        }
    }
}
