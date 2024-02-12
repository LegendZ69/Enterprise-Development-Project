import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Verify() {
    const formik = useFormik({
        initialValues: {
            email: "",
            verificationCode: ""
        },
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            verificationCode: yup.string().trim()
                .min(6, 'Verification code must be 6 characters')
                .max(6, 'Verification code must be 6 characters')
                .required('Verification code is required')
        }),
        onSubmit: (data) => {
            http.post("/user/verify", data)
            .then((res) => {
                // Store the JWT token in local storage
                localStorage.setItem("accessToken", res.data.accessToken);
                // Redirect the user to the dashboard or any other page
                window.location.href = "/";
            })
            .catch((err) => {
                toast.error(`${err.response.data}`);
            });
        }
    });

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Verify Email
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Verification Code"
                    name="verificationCode"
                    type="text"
                    value={formik.values.verificationCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.verificationCode && Boolean(formik.errors.verificationCode)}
                    helperText={formik.touched.verificationCode && formik.errors.verificationCode}
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }}
                    type="submit">
                    Verify
                </Button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default Verify;
