import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgetPassword() {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            Email: '',
        },
        validationSchema: yup.object({
            Email: yup.string().trim().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: async (data) => {
            setLoading(true);
            try {
                await http.post('/user/forgot-password', { Email: data.Email });
                toast.success('Password reset email sent successfully');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error sending password reset email');
            }
            setLoading(false);
        },
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Forgot Password
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Email"
                    name="Email"
                    type="email"
                    value={formik.values.Email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Email && Boolean(formik.errors.Email)}
                    helperText={formik.touched.Email && formik.errors.Email}
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={loading}>
                    Send Reset Email
                </Button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default ForgetPassword;
