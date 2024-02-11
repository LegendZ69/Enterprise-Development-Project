import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import http from '../http';

function BookingsDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 5; // Adjust the number of bookings per page as needed

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const fetchAllBookings = () => {
        http.get('/booking/adminBookings')
            .then((response) => {
                setBookings(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching bookings:', error);
                setError('Error fetching bookings. Please try again later.');
                setLoading(false);
            });
    };

    // Calculate the index of the last booking to display
    const indexOfLastBooking = currentPage * bookingsPerPage;
    // Calculate the index of the first booking to display
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    // Slice the bookings array to get the bookings for the current page
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (bookings.length === 0) {
        return <div>No bookings found.</div>;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Bookings Dashboard
            </Typography>
            {currentBookings.map((booking) => (
                <Box key={booking.id} sx={{ mb: 4, border: '1px solid #ccc', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Activity: {booking.activityTitle}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Date Booked: {new Date(booking.bookingDate).toLocaleDateString()}
                        </Typography>
                        {booking.price && (
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Total Price: ${booking.price}
                            </Typography>
                        )}
                    </Box>
                    <Box>
                        <Button variant="outlined" color="error" onClick={() => deleteBooking(booking.id)}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            ))}
            {/* Pagination */}  
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                {[...Array(Math.ceil(bookings.length / bookingsPerPage)).keys()].map((number) => (
                    <Button key={number + 1} onClick={() => paginate(number + 1)} variant="outlined" sx={{ mx: 1 }}>
                        {number + 1}
                    </Button>
                ))}
            </Box>
        </Box>
    );
}

export default BookingsDashboard;
