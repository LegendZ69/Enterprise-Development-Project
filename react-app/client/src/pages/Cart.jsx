import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

function Cart() {
  const [bookings, setBookings] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  useEffect(() => {
    http.get('/Booking/userBookings')
      .then((res) => {
        setBookings(res.data);
      })
      .catch((error) => {
        console.error('Failed to fetch bookings:', error.message);
      });
  }, []);

  useEffect(() => {
    let totalPrice = 0;
    bookings.forEach(booking => {
      totalPrice += booking.price;
    });
    setFinalPrice(totalPrice);
  }, [bookings]);

  const handleDeleteBooking = () => {
    if (bookingToDelete) {
      // Make a DELETE request to delete the booking with the given ID
      http.delete(`/Booking/${bookingToDelete.id}`)
        .then(() => {
          // Remove the deleted booking from the state
          setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingToDelete.id));
          setBookingToDelete(null);
          setDeleteConfirmationOpen(false);
        })
        .catch((error) => {
          console.error('Failed to delete booking:', error.message);
        });
    }
  };

  const openDeleteConfirmation = (booking) => {
    setBookingToDelete(booking);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setBookingToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity ID</TableCell>
              <TableCell>Activity Title</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Action</TableCell> {/* New table cell for the delete button */}
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.activityId}</TableCell>
                <TableCell>{booking.activityTitle}</TableCell>
                <TableCell>{booking.quantity}</TableCell>
                <TableCell>${booking.price}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => openDeleteConfirmation(booking)} // Open delete confirmation dialog
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">Final Price:</TableCell>
              <TableCell>${finalPrice}</TableCell>
              <TableCell></TableCell> {/* Empty cell for alignment */}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {bookings.length > 0 && ( // Render the pay button only if there are bookings
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Link to="/checkout" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Pay Now
            </Button>
          </Link>
        </Box>
      )}
      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteBooking} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Cart;
