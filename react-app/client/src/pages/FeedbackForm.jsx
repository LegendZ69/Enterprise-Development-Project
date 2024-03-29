import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Stack, } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import UserContext from '../contexts/UserContext';

function FeedbackForm() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const formik = useFormik({
        initialValues: user //if signed in as user, autofill fields with user info
            ? {
                email: user.email, 
                firstName: user.name,
                lastName: user.name,
                topic: "",
                message: ""
            } : {
                email: "nomail@mail.com",
                firstName: "",
                lastName: "",
                topic: "",
                message: ""
                },

        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(100, 'Email must be at most 100 characters')
                .required('Email is required'),
            firstName: yup.string().trim()
                .min(3, 'First Name must be at least 3 characters')
                .max(50, 'First Name must be at most 50 characters')
                .required('First Name is required'),
            lastName: yup.string().trim()
                .min(3, 'Last Name must be at least 3 characters')
                .max(50, 'Last Name must be at most 50 characters')
                .required('Last Name is required'),
            topic: yup.string()
                .required('Topic is required'),
            message: yup.string().trim()
                .min(3, 'Message must be at least 3 characters')
                .max(200, 'Message must be at most 200 characters')
                .required('Message is required')
        }),

        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.topic = data.topic;
            data.message = data.message.trim();
            http.post("/feedbackForm", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/formSuccess");
                })
                .catch(function (err) {
                    console.log(err.response);
                });
        }
    });

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Feedback Form
            </Typography>

            <Grid container spacing={12}>
                <Grid item xs={6}>
                    <iframe
                        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31909.302941679718!2d103.93467295405858!3d1.3789471609109833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da3db3e616ca81%3A0xb96062afab4f6058!2sSingapore%20519599!5e0!3m2!1sen!2ssg!4v1702980262703!5m2!1sen!2ssg`}
                        frameBorder={0}
                        width="600"
                        height="450"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Stack direction="column" spacing={2}>
                        <Typography gutterBottom>
                            <LocationOnIcon /> Market Square @ Downtown East
                            <br /> E!Avenue, Level 3
                            <br /> 1 Pasir Ris Close Singapore 519599 NTUC Club - UPlay
                        </Typography>

                        <Typography gutterBottom>
                            <EmailIcon /> sales@uplay.com.sg
                        </Typography>

                        <Typography gutterBottom>
                            <PhoneIcon /> +65 6192 8374
                        </Typography>
                    </Stack>

                </Grid>
            </Grid>

            {!user || !user.role == "admin" ? (
                <Typography variant="h6" sx={{ mt: 5, textAlign: 'center', fontWeight: 'bold' }}>
                    Have a message? Please login to contact us.
                </Typography>
            ) : (
                <Box component="form" onSubmit={formik.handleSubmit} mt={12}>
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

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
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
                                fullWidth margin="dense" autoComplete="off"
                                label="Last Name"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </Grid>
                    </Grid>

                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel id='topic'>Topic</InputLabel>
                        <Select margin="dense"
                            labelId='topic'
                            label="Topic"
                            name="topic"
                            value={formik.values.topic}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.topic && Boolean(formik.errors.topic)}
                            helperText={formik.touched.topic && formik.errors.topic}
                        >
                            <MenuItem value="Enquiry">General Enquiry</MenuItem>
                            <MenuItem value="Suggestions">Suggestions</MenuItem>
                            <MenuItem value="Improvements">Improvements</MenuItem>
                            <MenuItem value="Partnerships">Partnerships</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        multiline minRows={2}
                        label="Message"
                        name="message"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.message && Boolean(formik.errors.message)}
                        helperText={formik.touched.message && formik.errors.message}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Add
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default FeedbackForm