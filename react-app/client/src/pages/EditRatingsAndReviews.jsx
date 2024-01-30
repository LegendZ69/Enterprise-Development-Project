import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Rating } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditRatingsAndReviews() {
    const [value, setValue] = useState(0);

    const { id } = useParams();
    const navigate = useNavigate();

    const [ratingsAndReviews, setRatingsAndReviews] = useState({
        bookingId: "",
        bookingDate: "",
        email: "",
        firstName: "",
        lastName: "",
        rating: "",
        review: ""
    });

    useEffect(() => {
        http.get(`/ratingsAndReviews/${id}`).then((res) => {
            setRatingsAndReviews(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: ratingsAndReviews,
        enableReinitialize: true,
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
                .min(3, 'Review must be at least 3 characters')
                .max(200, 'Review must be at most 50 characters')
                .required('Review is required')
        }),

        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.rating = data.rating;
            data.review = data.review.trim();
            http.put(`/ratingsAndReviews/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/displayRatingsAndReviews");
                })
                .catch(function (err) {
                    console.log(err.response);
                });
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteRatingsAndReviews = () => {
        http.delete(`/ratingsAndReviews/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/displayRatingsAndReviews");
            })
            .catch(function (err) {
                console.log(err.response);
            });
    }

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Edit Ratings And Reviews
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>

                <Rating
                    name="rating"
                    size='large'
                    value={formik.values.rating}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        formik.setFieldValue('rating', newValue); // Update formik value
                    }}
                    fullWidth
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
                        Update
                    </Button>
                    <Button variant="contained" sx={{ ml: 2 }} color="error"
                        onClick={handleOpen}>
                        Delete
                    </Button>
                </Box>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Ratings And Reviews
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this ratings and reviews?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteRatingsAndReviews}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EditRatingsAndReviews