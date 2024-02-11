import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, RadioGroup, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

import { Discount } from '@mui/icons-material';
function AddCreditCard() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            cardNumber: "",
            firstName: "",
            lastName: "",
            city: "",
            address: ""
        },
        validationSchema: yup.object({
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
                .matches(/^[a-zA-Z0-9 ]*$/, 'Address can only contain letters, numbers, and spaces')
        }),
        onSubmit: async (data) => {
            try {
                // Trim input values
                data.cardNumber = data.cardNumber.trim();
                data.firstName = data.firstName.trim();
                data.lastName = data.lastName.trim();
                data.city = data.city.trim();
                data.address = data.address.trim();

                const response = await http.post('/creditcard', data);
                
                // Handle success response
                console.log(response.data);
                navigate('/creditcard'); // Navigate to success page or any other page
                
            } catch (error) {
                // Handle error response
                console.error(error);
            }
        },
    });

return (
    <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
            Add Credit Card
        </Typography>
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Card Number"
                        name="cardNumber"
                        value={formik.values.cardNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                        helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.city && Boolean(formik.errors.city)}
                        helperText={formik.touched.city && formik.errors.city}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" type="submit">Submit</Button>
                </Grid>
            </Grid>
        </form>
    </Box>
);
}

export default AddCreditCard;