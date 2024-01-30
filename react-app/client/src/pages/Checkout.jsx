import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, TextField, Grid } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';


function Checkout() {
    const PRICE = 1000;
    const [couponName, setCouponName] = useState('');
    const [discount, setDiscount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(PRICE);
    const [errorMessage, setErrorMessage] = useState('');

    const handleApplyCoupon = () => {
        http.get(`/coupons?name=${couponName}`)
            .then((res) => {
                const coupons = res.data;
                const coupon = coupons.find(coupon => coupon.couponName === couponName);
                if (coupon) {
                    setDiscount(coupon.discount);
                    setFinalPrice(PRICE - coupon.discount);
                    setErrorMessage('Coupon Applied');
                } else {
                    setDiscount(0);
                    setFinalPrice(PRICE);
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
                    Activity Name: Private Yacht Activity
                    
                </Typography>
                <Typography variant="h6">
                    Original Price: ${PRICE} 
                    <br>
                    </br>
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
            <Grid item xs={12} mt={2}>
                <Typography variant="h6">Final Price: ${finalPrice}</Typography>
            </Grid>
        </>
    )
}

export default Checkout;