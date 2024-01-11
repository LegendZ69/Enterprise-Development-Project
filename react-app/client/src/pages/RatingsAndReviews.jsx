import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Rating } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import StaffContext from '../contexts/StaffContext';
// import UserContext from '../contexts/UserContext';

function RatingsAndReviews() {
    const navigate = useNavigate();

    // const [value, setValue] = useState < number | null > (2);

    const [value, setValue] = useState(0);

    //add form as user/staff
    // const { staff } = useContext(StaffContext);
    // const { user } = useContext(UserContext);

    const formik = useFormik({
        // initialValues: user //if signed in as user, autofill fields with user info
        //     ? {
        //         // email: user.email, //merge with user.id
        // activityName: "",
        // activityType: "",
        // activityDescription: "",
        // activityReason: ""
        //     }
        //     : staff
        //         ? {
        //             // email: staff.email, //merge with user.id
        // activityName: "",
        // activityType: "",
        // activityDescription: "",
        // activityReason: ""
        //         }
        //         : {
        // email: "",
        // activityName: "",
        // activityType: "",
        // activityDescription: "",
        // activityReason: ""
        //         },

        initialValues: {
            // email: user.email, //merge with user.id
            bookingId: "",
            bookingDate: "",
            email: "",
            firstName: "",
            lastName: "",
            rating: 0,
            review: ""
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
            rating: yup.number()
                // .min(1, 'Rating should be at least 1 star')
                // .max(5, 'Rating should be at most 5 stars')
                .required('Rating is required'),
            review: yup.string().trim()
                .min(3, 'review must be at least 3 characters')
                .max(200, 'review must be at most 50 characters')
                .required('review is required')
        }),

        onSubmit: (data) => {
            // data.bookingId = data.bookingId;
            // data.bookingDate = data.bookingDate;
            data.email = data.email.trim().toLowerCase();
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.rating = data.rating;
            data.review = data.review.trim();

            //if AccessToken is staff, post form as staff else user
            // if (localStorage.getItem("staffAccessToken")) {
            //     http.post("/contactUsForm/staff", data)
            //         .then((res) => {
            //             console.log(res.data);
            //             navigate("/formSuccess");
            //         })
            //         .catch(function (err) {
            //             toast.error(`${err.response.data.message}`);
            //         });
            // } else if (localStorage.getItem("userAccessToken")) {
            //     http.post("/contactUsForm/user", data)
            //         .then((res) => {
            //             console.log(res.data);
            //             navigate("/formSuccess");
            //         })
            //         .catch(function (err) {
            //             toast.error(`${err.response.data.message}`);
            //         });
            // };

            //delete this after merge
            http.post("/ratingsAndReviews", data)
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
                Ratings and Reviews
            </Typography>

            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                Activity Name: integrate with team member for part 2
            </Typography>
            <Box sx={{ display: 'flex', mb: 2 }} color="text.secondary">
                <AccessTime fontSize='small' />
                <Typography variant='body2'>
                    Booking Date{/* {dayjs(bookingId.createdAt).format(global.datetimeFormat)} */}: integrate with team member for part 2
                </Typography>
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit}>
                {/* remove email field, only allow signed in user to suggest / review */}
                <Rating
                    name="rating"
                    size='large'
                    value={formik.values.rating}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        formik.setFieldValue('rating', newValue); // Update formik value
                    }}
                    fullWidth
                    // multiline minRows={2}
                    label="Rating"
                    error={formik.touched.rating && Boolean(formik.errors.rating)}
                    helperText={formik.touched.rating && formik.errors.rating}
                />

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

                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="Review"
                    name="review"
                    value={formik.values.review}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.review && Boolean(formik.errors.review)}
                    helperText={formik.touched.review && formik.errors.review}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default RatingsAndReviews