import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Cart() {
  const [bookings, setBookings] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);

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
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.activityId}</TableCell>
                <TableCell>{booking.activityTitle}</TableCell>
                <TableCell>{booking.quantity}</TableCell>
                <TableCell>${booking.price}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">Final Price:</TableCell>
              <TableCell>${finalPrice}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
        <Link to="/checkout" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Pay Now
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default Cart;
