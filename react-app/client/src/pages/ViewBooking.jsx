import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';

function BookingTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    http.get(`/booking/${id}`)
      .then((res) => {
        console.log('API Response:', res.data);
        setBooking(res.data);
      })
      .catch((error) => {
        console.error('Error fetching booking:', error.message);
        setError('Error fetching booking details. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const goBack = () => {
    navigate("/UserBookings");
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!booking) {
    return <div>No booking found for ID: {id}</div>;
  }

  return (
    <Box sx={{ pt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        {booking.activityTitle}
      </Typography>
      {booking.activityImage && (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <img
            alt="Activity"
            src={`${import.meta.env.VITE_FILE_BASE_URL}${booking.activityImage}`}
            style={{ width: '100%', maxWidth: '400px', height: 'auto', borderRadius: '8px' }}
          />
        </Box>
      )}
      <Typography variant="body1" sx={{ mb: 2 }}>
        Booking ID: {booking.id}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Quantity: {booking.quantity}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Price: ${booking.price}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Timeslot Booked: {dayjs(booking.selectedTimeSlot, 'HH:mm').format('HH:mm')}
      </Typography>
      <Button variant="contained" onClick={goBack} sx={{ mt: 2 }}>
        Go Back
      </Button>
    </Box>
  );
}

export default BookingTest;
