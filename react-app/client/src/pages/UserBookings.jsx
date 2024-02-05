// UserBookings.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import http from '../http';

function UserBookings() {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 3; // Adjust the number of bookings per page as needed

  useEffect(() => {
    http.get('/booking/userBookings')
      .then((res) => {
        console.log('API Response:', res.data);
        setUserBookings(res.data);
      })
      .catch((error) => {
        console.error('Error fetching user bookings:', error.message);
        setError('Error fetching user bookings. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calculate the index of the last booking to display
  const indexOfLastBooking = currentPage * bookingsPerPage;
  // Calculate the index of the first booking to display
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  // Slice the userBookings array to get the bookings for the current page
  const currentBookings = userBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (userBookings.length === 0) {
    return <div>No bookings found for the user.</div>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        User Bookings
      </Typography>
      {currentBookings.map((booking) => (
        <Box key={booking.id} sx={{ mb: 4, border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Activity: {booking.activityTitle}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Date Booked: {new Date(booking.bookingDate).toLocaleDateString()}
          </Typography>
          <Link to={`/viewBooking/${booking.id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              View Details
            </Button>
          </Link>
        </Box>
      ))}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        {[...Array(Math.ceil(userBookings.length / bookingsPerPage)).keys()].map((number) => (
          <Button key={number + 1} onClick={() => paginate(number + 1)} variant="outlined" sx={{ mx: 1 }}>
            {number + 1}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default UserBookings;
