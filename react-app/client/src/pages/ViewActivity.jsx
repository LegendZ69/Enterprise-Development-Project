import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    http.get(`/activity/${id}`)
      .then((res) => {
        setActivity(res.data);
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

  const handleBookClick = () => {
    const requestData = {
      bookingDate: bookingDate.toISOString().split('T')[0],
      quantity: quantity,
    };

    http.post(`/booking/${id}`, requestData)
      .then((res) => {
        const newBookingId = res.data.id; // Extract the bookingId from the response
        console.log('Booking successful:', res.data);
        toast.success('Booking successful');

        // Navigate to the BookingTest component with the newBookingId
        navigate(`/bookingTest/${newBookingId}`);
      })
      .catch((error) => {
        console.error('Booking failed:', error.message);
        toast.error(`Booking failed: ${error.response.data.message || 'Unknown error'}`);
      });
  };

  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      {/* Activity Details */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        View Activity
      </Typography>
      <Typography variant="h6" sx={{ my: 2 }}>
        Title: {activity.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Description: {activity.description}
      </Typography>
      {activity.imageFile && (
        <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
          <img
            alt="activity"
            src={`${import.meta.env.VITE_FILE_BASE_URL}${activity.imageFile}`}
          />
        </Box>
      )}

      {/* Quantity Input */}
      <TextField
        id="quantity"
        label="Quantity"
        type="number"
        value={quantity}
        onChange={handleQuantityChange}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ mt: 2 }}
      />

      {/* Booking Date Picker */}
      <TextField
        id="booking-date"
        label="Select Booking Date"
        type="date"
        defaultValue={bookingDate.toISOString().split('T')[0]}
        onChange={(e) => handleBookingDateChange(new Date(e.target.value))}
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ mt: 2 }}
      />

      {/* Book Button */}
        <Button variant="contained" color="primary" onClick={handleBookClick} sx={{ mt: 2 }}>
          Book
        </Button>

      <ToastContainer />
    </Box>
  );
}

export default ViewActivity;
