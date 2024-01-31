import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import UserContext from '../contexts/UserContext';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            CurrentPassword: '',
            NewPassword: '',
            ConfirmPassword: '',
        },
        validationSchema: yup.object({
            CurrentPassword: yup.string().trim().required('Current password is required'),
            NewPassword: yup.string().trim().min(8, 'Password must be at least 8 characters').required('New password is required'),
            ConfirmPassword: yup.string().trim().oneOf([yup.ref('NewPassword'), null], 'Passwords must match'),
        }),
        onSubmit: (data) => {
            // Assuming that user.id is the ID of the currently logged-in user
            const url = `/user/changepassword?id=${user.id}`;

            http.put(url, { CurrentPassword: data.CurrentPassword, NewPassword: data.NewPassword })
                .then((res) => {
                    navigate("/profile");
                    toast.success('Password changed successfully');
                })
                .catch((error) => {
                    toast.error(error.response.data.message || 'Error changing password');
                });
        },
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Change Password
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Current Password"
                    name="CurrentPassword"
                    type="password"
                    value={formik.values.CurrentPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.CurrentPassword && Boolean(formik.errors.CurrentPassword)}
                    helperText={formik.touched.CurrentPassword && formik.errors.CurrentPassword}
                />
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
                <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
                    Change Password
                </Button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default ChangePassword;
