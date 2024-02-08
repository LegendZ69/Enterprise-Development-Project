import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Card, CardContent, MenuItem } from '@mui/material';
import SportsIcon from '@mui/icons-material/Sports';
import FamilyIcon from '@mui/icons-material/FamilyRestroom';
import LeisureIcon from '@mui/icons-material/BeachAccess';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [bookingDate, setBookingDate] = useState(dayjs()); // Initialize with current date
  const [quantity, setQuantity] = useState(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeSlotsList, setTimeSlotsList] = useState([]);

  useEffect(() => {
    http.get(`/activity/${id}`)
      .then((res) => {
        setActivity(res.data);
        console.log('Fetched activity:', res.data); // Add this line to inspect the fetched activity
        if (res.data.timeslots && res.data.timeslots.length > 0) {
          const slots = res.data.timeslots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
          }));
          setTimeSlotsList(slots);
        }
      })
      .catch((error) => {
        console.error('Error fetching activity:', error.message);
      });
  }, [id]);

  const handleBookingDateChange = (date) => {
    setBookingDate(date);
};


  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
  };

  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
  };

  const handleAddToCartClick = () => {
    const requestData = {
      bookingDate: bookingDate.toISOString().split('T')[0],
      quantity: quantity,
      selectedTimeSlot: selectedTimeSlot, // Change here
    };

    http.post(`/booking/${id}`, requestData)
      .then((res) => {
        const newBookingId = res.data.id;
        console.log('Booking successful:', res.data);
        toast.success('Activity added to cart');
      })
      .catch((error) => {
        console.error('Booking failed:', error.message);
        toast.error(`Failed to add activity to cart: ${error.response?.data?.message || 'Unknown error'}`);
      });
  };

  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ mt: 10 }}>
      {/* Category Text and Icon */}
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {/* Category Icon */}
        {activity.category === 'sports' && <SportsIcon sx={{ mr: 1, fontSize: 30, fontWeight: 'bold' }} />}
        {activity.category === 'family' && <FamilyIcon sx={{ mr: 1, fontSize: 30, fontWeight: 'bold' }} />}
        {activity.category === 'leisure' && <LeisureIcon sx={{ mr: 1, fontSize: 30, fontWeight: 'bold' }} />}

        {/* Category Text */}
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
        </Typography>
      </Typography>

      {/* Activity Title */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        {activity.title}
      </Typography>

      {/* Activity Image */}
      {activity.imageFile && (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <img
            alt="activity"
            src={`${import.meta.env.VITE_FILE_BASE_URL}${activity.imageFile}`}
            style={{ width: '65%', height: '100%', borderRadius: '8px' }}
          />
        </Box>
      )}

      {/* Activity Date, Location, and Description */}
      <Card>
        <CardContent>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {/* Date Icon */}
            <EventIcon sx={{ mr: 1, fontSize: 24, color: 'primary.main' }} />
            {/* Date */}
            <Typography variant="body2" style={{ fontSize: '24px' }}>
              {new Date(activity.eventDate).toLocaleDateString('en-GB')}
            </Typography>
          </Typography>

          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {/* Location Icon */}
            <LocationOnIcon sx={{ mr: 1, fontSize: 24, color: 'secondary.main' }} />
            {/* Location */}
            <Typography variant="body2" style={{ fontSize: '24px' }}>
              {activity.location}
            </Typography>
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap', fontSize: '18px' }}>
            {activity.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Price and Booking Section */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Card sx={{ width: '300px', marginRight: '16px' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Price */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Price: ${activity.price}
            </Typography>

            {/* Quantity */}
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              sx={{ mb: 2 }}
            />

            {/* Booking Date Picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
                            <DatePicker
                                sx={{ width: '100%' }}
                                margin="dense"
                                label="Select Booking Date"
                                name="bookingDate"
                                value={bookingDate}
                                onChange={handleBookingDateChange}
                                onBlur={handleBookingDateChange}
                                renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
                            />
                        </LocalizationProvider>

            {/* Time Slot Dropdown */}
            <TextField
              select
              label="Select Time Slot"
              value={selectedTimeSlot || ''}
              onChange={handleTimeSlotChange}
              sx={{ width: '100%', mb: 2 }}
            >
              {timeSlotsList.map((slot, index) => (
                <MenuItem key={index} value={slot.startTime + '-' + slot.endTime}>
                  {slot.startTime} - {slot.endTime}
                </MenuItem>
              ))}
            </TextField>

            {/* Buttons Container */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCartClick}
                sx={{ flex: 1, marginRight: '8px' }}
              >
                Add to Cart
              </Button>

              {/* Go to Cart Button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  navigate('/cart');
                }}
                sx={{ flex: 1 }}
              >
                Go to Cart
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default ViewActivity;