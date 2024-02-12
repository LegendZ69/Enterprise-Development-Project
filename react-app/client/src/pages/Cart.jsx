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
    let processedBookingsCount = 0; // Counter to track processed bookings
    bookings.forEach(booking => {
      http.get(`/activity/${booking.activityId}`)
        .then((res) => {
          const activity = res.data;
          totalPrice += activity.price * booking.quantity;
          const updatedBookings = bookings.map(item => {
            if (item.activityId === activity.id) {
              return {
                ...item,
                price: activity.price * booking.quantity
              };
            }
            return item;
          });
          setBookings(updatedBookings);
          processedBookingsCount++; // Increment the counter
          if (processedBookingsCount === bookings.length) {
            setFinalPrice(totalPrice); // Set final price after all bookings are processed
          }
        })
        .catch((error) => {
          console.error(`Failed to fetch activity for booking ${booking.id}:`, error.message);
        });
    });
  }, [bookings]); // Run when bookings state changes

  return (
    <div>
      <h2>Cart</h2>
      {bookings.map((booking) => (
        <div key={booking.id}>
          <p>Activity ID: {booking.activityId}, Activity Title: {booking.activityTitle}, Price: ${booking.price}, Quantity: {booking.quantity}</p>
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
