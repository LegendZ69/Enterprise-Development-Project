import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Rating } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function RatingsAndReviews() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const { user } = useContext(UserContext);

    const [value, setValue] = useState(0);

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }
            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    const formik = useFormik({
        initialValues: user //if signed in as user, autofill fields with user info
            ? {
                email: user.email,
                bookingId: "",
                bookingDate: "",
                firstName: user.name,
                lastName: user.name,
                rating: 0,
                review: ""
            } : {
                email: "nomail@mail.com",
                bookingId: "",
                bookingDate: "",
                firstName: "",
                lastName: "",
                rating: 0,
                review: ""
            },

        validationSchema: yup.object({
            rating: yup.number()
                .min(1, 'Rating should be at least 1 star')
                .max(5, 'Rating should be at most 5 stars')
                .required('Rating is required'),
            review: yup.string().trim()
                .min(3, 'Review must be at least 3 characters')
                .max(200, 'Review must be at most 50 characters')
                .required('Review is required')
        }),

        onSubmit: (data) => {
            // data.bookingId = data.bookingId;
            // data.bookingDate = data.bookingDate;
            //data.activityId = activity.Id
            data.email = data.email.trim().toLowerCase();
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.rating = data.rating;
            data.review = data.review.trim();
            if (imageFile) {
                data.imageFile = imageFile;
            }
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

            {!user || !user.role === "admin" ? (
                <Typography variant="h6" sx={{ mt: 5, textAlign: 'center', fontWeight: 'bold' }}>
                    You must be logged in.
                </Typography>
            ) : (
                <Box>
                    {/* <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                        Activity Name: integrate with team member for part 2
                    </Typography>
                    <Box sx={{ display: 'flex', mb: 2 }} color="text.secondary">
                        <AccessTime fontSize='small' />
                        <Typography variant='body2'>
                            Booking Date{dayjs(booking.createdAt).format(global.datetimeFormat)}: integrate with team member for part 2
                        </Typography>
                    </Box> */}

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
                                // multiline minRows={2}
                            label="Rating"
                            error={formik.touched.rating && Boolean(formik.errors.rating)}
                            helperText={formik.touched.rating && formik.errors.rating}
                        />

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

                        <Box sx={{ textAlign: 'center', mt: 2 }} >
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                            </Button>
                        </Box>

                        {
                            imageFile && (
                                <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                    <img alt="Reviews Photo"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                    </img>
                                </Box>
                            )
                        }

                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Add
                            </Button>
                        </Box>
                    </Box>
                    <ToastContainer />
                </Box>
            )}
        </Box>
    )
}

export default RatingsAndReviews