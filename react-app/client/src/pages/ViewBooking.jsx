import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import http from '../http';

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
    <Box>
      {/* Booking Details */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Booking Details
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Booking ID: {booking.id}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Activity ID: {booking.activityId}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Activity Name: {booking.activityTitle} {/* Display ActivityName */}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        User ID: {booking.userId}
      </Typography>

      {/* Additional UI elements, e.g., a button to navigate back */}
      <Button variant="contained" onClick={goBack}>
        Go Back
      </Button>
    </Box>
  );
}

export default BookingTest;
