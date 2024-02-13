import React, { useEffect, useState, useContext } from 'react';
import { Typography, Box, Button, TextField, Grid } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';

function Checkout() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Get the user context
    const [couponName, setCouponName] = useState('');
    const [discount, setDiscount] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [costReduction, setCostReduction] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [creditCardData, setCreditCardData] = useState(null);

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
        http.get("/creditcard") // Fetch credit card data
            .then((res) => {
                const cardData = res.data;
                console.log("Credit Card Data:", cardData);
                if (cardData && cardData.userId === user.id) {
                    console.log("User ID matches, setting credit card data...");
                    setCreditCardData(cardData);
                    // Set formik values if credit card data matches user ID
                    formik.setValues({
                        cardNumber: cardData ? cardData.cardNumber : '',
                        firstName: cardData ? cardData.firstName : '',
                        lastName: cardData ? cardData.lastName : '',
                        city: cardData ? cardData.city : '',
                        address: cardData ? cardData.address : '',
                        cvv: '',
                    });
                }
            })
            .catch((error) => {
                console.error('Failed to fetch credit card data:', error.message);
            });
    }, []); // Empty dependency array to run once when component mounts


    useEffect(() => {
        let totalOriginalPrice = 0;
        bookings.forEach(booking => {
            totalOriginalPrice += booking.price;
        });
        setOriginalPrice(totalOriginalPrice);
        setFinalPrice(totalOriginalPrice - discount);
    }, [bookings, discount]);

    const handleApplyCoupon = () => {
        http.get(`/coupons?name=${couponName}`)
            .then((res) => {
                const coupons = res.data;
                const coupon = coupons.find(coupon => coupon.couponName === couponName && coupon.valid && coupon.usage > 0); // Check for valid and used coupons
                if (coupon) {
                    setDiscount(coupon.discount);
                    const calculatedCostReduction = originalPrice - (originalPrice - coupon.discount);
                    setCostReduction(calculatedCostReduction);
                    const calculatedFinalPrice = Math.max(0, originalPrice - coupon.discount); // Ensure final price doesn't go below 0
                    setFinalPrice(calculatedFinalPrice);
                    setErrorMessage('Coupon Applied');
                } else {
                    setDiscount(0);
                    setFinalPrice(originalPrice); // Reset final price if coupon not found or invalid
                    setErrorMessage('Invalid or expired coupon');
                }
            })
            .catch((error) => {
                console.error('Error applying coupon:', error);
                setErrorMessage('Error applying coupon');
            });
    };


    const handleFormSubmit = (values) => {
        console.log(values); // You can handle form submission here
    
        // Prepare payment data
        const paymentData = {
            price: finalPrice,
            activityTitle: bookings.map(booking => booking.activityTitle).join(' + '),
            bookedDate: bookings.map(booking => dayjs(booking.bookingDate).format('YYYY-MM-DD')).join(' + '),
        };
    
        // Send payment data to the server
        http.post('/Payments', paymentData)
            .then((res) => {
                console.log('Payment successful:', res.data);
                // Fetch user bookings to get the list of booking IDs
                http.get(`/Booking/userBookings`)
                    .then((res) => {
                        const bookings = res.data;
                        const userId = user.id;
    
                        // Filter bookings for the current user
                        const userBookings = bookings.filter(booking => booking.userId === userId);
    
                        // Delete all bookings associated with the current user
                        userBookings.forEach((booking) => {
                            http.delete(`/Booking/${booking.id}`)
                                .then((res) => {
                                    console.log(`Booking ${booking.id} deleted successfully`);
                                })
                                .catch((error) => {
                                    console.error(`Failed to delete booking ${booking.id}:`, error);
                                    // Handle error
                                });
                        });
    
                        // Navigate to the checkout success page
                        navigate('/checkoutsuccess');
                    })
                    .catch((error) => {
                        console.error('Failed to fetch user bookings:', error);
                        // Handle error
                    });
            })
            .catch((error) => {
                console.error('Payment failed:', error);
                // Handle payment failure
            });
    };
    
    

    const validationSchema = yup.object({
        cardNumber: yup.string()
            .required('Card number is required')
            .matches(/^\d{16}$/, 'Card number must be exactly 16 digits'),
        firstName: yup.string()
            .required('First name is required')
            .matches(/^[a-zA-Z ]*$/, 'First name can only contain letters and spaces'),
        lastName: yup.string()
            .required('Last name is required')
            .matches(/^[a-zA-Z ]*$/, 'Last name can only contain letters and spaces'),
        city: yup.string()
            .required('City is required')
            .matches(/^[a-zA-Z ]*$/, 'City can only contain letters and spaces'),
        address: yup.string()
            .required('Address is required')
            .matches(/^[a-zA-Z0-9 ]*$/, 'Address can only contain letters, numbers, and spaces'),
        cvv: yup.string()
            .required('CVV is required')
            .matches(/^\d{3}$/, 'CVV must be exactly 3 digits'),
    });

    const formik = useFormik({
        initialValues: {
            cardNumber: creditCardData ? creditCardData.cardNumber : '',
            firstName: creditCardData ? creditCardData.firstName : '',
            lastName: creditCardData ? creditCardData.lastName : '',
            city: creditCardData ? creditCardData.city : '',
            address: creditCardData ? creditCardData.address : '',
            cvv: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleFormSubmit,
    });
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Box>
                    <Typography variant="h4" sx={{ my: 2 }}>
                        Checkout
                    </Typography>
                    <Typography variant="h6">
                        Original Price: ${originalPrice}
                        <br />
                        &nbsp;
                    </Typography>
                    <Typography variant="h6">
                        You can use the coupon "Coupon" for $20 off
                        <br />
                        &nbsp;
                    </Typography>

                    <TextField
                        label="Coupon Name"
                        value={couponName}
                        
                        onChange={(e) => setCouponName(e.target.value)}
                    />
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
                    <Typography variant="h6">Final Price: ${finalPrice}</Typography>
                </Box>
            </Grid>

            <Grid item xs={6}>
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        Credit Card Information
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            label="Card Number"
                            name="cardNumber"
                            value={formik.values.cardNumber}
                            onChange={formik.handleChange}
                            helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                            fullWidth
                        />
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            fullWidth
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            fullWidth
                        />
                        <TextField
                            label="City"
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            helperText={formik.touched.city && formik.errors.city}
                            fullWidth
                        />
                        <TextField
                            label="Address"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            helperText={formik.touched.address && formik.errors.address}
                            fullWidth
                        />
                        <TextField
                            label="CVV"
                            name="cvv"
                            value={formik.values.cvv}
                            onChange={formik.handleChange}
                            helperText={formik.touched.cvv && formik.errors.cvv}
                            fullWidth
                        />
                        <Box mt={2}>
                            <Button type="submit" variant="contained">Submit</Button>
                        </Box>
                    </form>
                </Box>
            </Grid>
        </Grid>
    );
}


export default Checkout;