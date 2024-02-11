import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import http from '../http';

function BookingsDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 5; // Adjust the number of bookings per page as needed

    useEffect(() => {
        fetchAllBookings();
    }, [currentPage]); // Include currentPage in the dependency array

    const fetchAllBookings = () => {
        http.get(`/booking/adminBookings?page=${currentPage}&pageSize=${bookingsPerPage}`)
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

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(bookings.length / bookingsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const deleteBooking = (id) => {
        http.delete(`/booking/${id}`)
            .then(() => {
                fetchAllBookings();
            })
            .catch((error) => {
                console.error('Error deleting booking:', error.message);
            });
    };

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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Booking ID</TableCell>
                            <TableCell>Activity ID</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Activity Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.id}</TableCell>
                                <TableCell>{booking.activityId}</TableCell>
                                <TableCell>{booking.activityTitle}</TableCell>
                                <TableCell>{booking.userId}</TableCell>
                                <TableCell>{booking.user.name}</TableCell>
                                <TableCell>
                                    <Button onClick={() => deleteBooking(booking.id)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</Button>
                <Button disabled={currentPage === Math.ceil(bookings.length / bookingsPerPage)} onClick={handleNextPage}>Next</Button>
            </Box>
        </Box>
    );
}

export default BookingsDashboard;
