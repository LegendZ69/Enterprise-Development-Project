import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Grid, RadioGroup, FormControl } from '@mui/material';


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
    <div>
      <h2>Cart</h2>
      {bookings.map((booking) => (
        <div key={booking.id}>
          <p>Activity ID: {booking.activityId}, Activity Title: {booking.activityTitle}, Quantity: {booking.quantity}, Total Price: ${booking.price}</p>
        </div>
      ))}
      <p>Final Price: ${finalPrice}</p>
      <Link to="/checkout">
        <button>Pay Now</button>
      </Link>
    </div>
  );
}

export default Cart;
