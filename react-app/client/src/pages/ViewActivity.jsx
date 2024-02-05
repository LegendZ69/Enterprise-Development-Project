import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewActivity() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date());

  useEffect(() => {
    http.get(`/activity/${id}`).then((res) => {
      setActivity(res.data);
    });
  }, [id]);

  const handleBookingDateChange = (date) => {
    setBookingDate(date);
  };

  const handleBookClick = () => {
    const requestData = {
      bookingDate: bookingDate.toISOString().split('T')[0],
    };

    http.post(`/activity/book/${id}`, requestData)
      .then((res) => {
        console.log('Booking successful:', res.data);
        toast.success('Booking successful');
      })
      .catch((error) => {
        console.error('Booking failed:', error.message);
        toast.error('Booking failed');
      });
  };

  if (!activity) {
    return <div>PAGE DOES NOT EXIST</div>;
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
      <Link to="/confirmbooking" style={{ textDecoration: 'none' }}>
      <Button variant="contained" color="primary" onClick={handleBookClick} sx={{ mt: 2 }}>
        Book
      </Button>
      </Link>

      <ToastContainer />
    </Box>
  );
}

export default ViewActivity;
