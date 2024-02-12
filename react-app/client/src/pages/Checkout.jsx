import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, TextField, Grid } from '@mui/material';
import http from '../http';

function Checkout() {
    const [couponName, setCouponName] = useState('');
    const [discount, setDiscount] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [costReduction, setCostReduction] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let totalOriginalPrice = 0;
        bookings.forEach(booking => {
            totalOriginalPrice += booking.price;
        });
        setOriginalPrice(totalOriginalPrice);
        setFinalPrice(totalOriginalPrice - discount);
    }, [bookings, discount]);

    useEffect(() => {
        http.get('/Booking/userBookings')
            .then((res) => {
                setBookings(res.data);
            })
            .catch((error) => {
                console.error('Failed to fetch bookings:', error.message);
            });
    }, []);

    const handleApplyCoupon = () => {
        http.get(`/coupons?name=${couponName}`)
            .then((res) => {
                const coupons = res.data;
                const coupon = coupons.find(coupon => coupon.couponName === couponName);
                if (coupon) {
                    setDiscount(coupon.discount);
                    setCostReduction(originalPrice - (originalPrice - coupon.discount));
                    setErrorMessage('Coupon Applied');
                } else {
                    setDiscount(0);
                    setErrorMessage('Coupon not found');
                }
            })
            .catch((error) => {
                console.error('Error applying coupon:', error);
                setErrorMessage('Error applying coupon');
            });
    };

    return (
        <>
            <Box>
                <Typography variant="h4" sx={{ my: 2 }}>
                    Checkout
                </Typography>
                <Typography variant="h6">
                    Original Price: ${originalPrice} 
                    <br />
                    &nbsp;
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Coupon Name"
                            value={couponName}
                            onChange={(e) => setCouponName(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box mt={2}>
                <Button variant="contained" onClick={handleApplyCoupon}>Apply Coupon</Button>
            </Box>
            {errorMessage && (
                <Typography variant="body2" color={errorMessage === 'Coupon Applied' ? 'success' : 'error'} sx={{ mt: 1 }}>
                    {errorMessage}
                </Typography>
            )}
            {discount > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Cost Reduction from Coupon: ${costReduction}
                </Typography>
            )}
            <Grid item xs={12} mt={2}>
                <Typography variant="h6">Final Price: ${finalPrice}</Typography>
            </Grid>
        </>
    )
}

export default Checkout;
