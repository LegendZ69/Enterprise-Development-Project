import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function ResetPassword() {
    const query = useQuery();
    const token = query.get('token');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            NewPassword: '',
            ConfirmPassword: '',
        },
        validationSchema: yup.object({
            NewPassword: yup.string().trim().min(12, 'Password must be at least 12 characters')
            .max(50, 'Password must be at most 50 characters')
            .required('Password is required')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,}$/, "Password must include lowercase, uppercase, number, and special character"),
            ConfirmPassword: yup.string().trim().required('Confirm password is required')
            .oneOf([yup.ref('NewPassword')], 'Passwords must match'),
        }),
        onSubmit: async (data) => {
            setLoading(true);
            try {
                await http.post('/user/reset-password', { Token: token, NewPassword: data.NewPassword, ConfirmPassword: data.ConfirmPassword });
                toast.success('Password reset successful');
                navigate('/login');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error resetting password');
            }
            setLoading(false);
        },
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Reset Password
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="New Password"
                    name="NewPassword"
                    type="password"
                    value={formik.values.NewPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.NewPassword && Boolean(formik.errors.NewPassword)}
                    helperText={formik.touched.NewPassword && formik.errors.NewPassword}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Confirm Password"
                    name="ConfirmPassword"
                    type="password"
                    value={formik.values.ConfirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.ConfirmPassword && Boolean(formik.errors.ConfirmPassword)}
                    helperText={formik.touched.ConfirmPassword && formik.errors.ConfirmPassword}
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={loading}>
                    Reset Password
                </Button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default ResetPassword;
