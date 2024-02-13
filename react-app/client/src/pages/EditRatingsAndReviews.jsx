import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Rating, Divider } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function EditRatingsAndReviews() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const { user } = useContext(UserContext);

    const [value, setValue] = useState(0);

    const [ratingsAndReviews, setRatingsAndReviews] = useState({
        rating: "",
        review: "",
        imageFile: "",
        staffRemark: ""
    });

    useEffect(() => {
        http.get(`/ratingsAndReviews/${id}`).then((res) => {
            setRatingsAndReviews(res.data);
            setImageFile(res.data.imageFile);
        });
    }, []);

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
        initialValues: ratingsAndReviews,
        enableReinitialize: true,
        validationSchema: yup.object({
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
            if (imageFile) {
                data.imageFile = imageFile;
            }

            if (user.role == "user") {
                http.put(`/ratingsAndReviews/${id}`, data)
                    .then((res) => {
                        console.log(res.data);
                        navigate("/displayRatingsAndReviews");
                    })
                    .catch(function (err) {
                        console.log(err.response);
                    });
            } else if (user.role == "admin") {
                http.put(`/ratingsAndReviews/admin/${id}`, data)
                    .then((res) => {
                        console.log(res.data);
                        navigate("/displayRatingsAndReviews");
                    })
                    .catch(function (err) {
                        console.log(err.response);
                    });
            }
        }
    });

    const submitStaffRemark = (remark) => {
        formik.setValues({
            ...formik.values,
            staffRemark: remark
        });

        formik.handleSubmit();
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteRatingsAndReviews = () => {
        if (user.role == "user") {
            http.delete(`/ratingsAndReviews/${id}`)
                .then((res) => {
                    console.log(res.data);
                    navigate("/displayRatingsAndReviews");
                })
                .catch(function (err) {
                    console.log(err.response);
                });
        } else if (user.role == "admin") {
            http.delete(`/ratingsAndReviews/admin/${id}`)
                .then((res) => {
                    console.log(res.data);
                    navigate("/displayRatingsAndReviews");
                })
                .catch(function (err) {
                    console.log(err.response);
                });
        }
    }

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Edit Ratings And Reviews
            </Typography>

            {
                user && (
                    <Box>
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
                                        <img alt="Update Reviews Photo"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                        </img>
                                    </Box>
                                )
                            }

                            {user.role == "admin" && (
                                <React.Fragment>
                                    <Divider sx={{ border: '1px solid grey', my: 2 }}></Divider>

                                    <TextField
                                        fullWidth margin="normal" autoComplete="on"
                                        multiline minRows={4}
                                        label="Staff Remark"
                                        name="staffRemark"
                                        value={formik.values.staffRemark}
                                        onChange={formik.handleChange}
                                        error={formik.touched.staffRemark && Boolean(formik.errors.staffRemark)}
                                        helperText={formik.touched.staffRemark && formik.errors.staffRemark}
                                    />

                                    <Button variant="contained" onClick={() => submitStaffRemark("Please be mindful of your language.")}
                                    >
                                        Please be mindful of your language.
                                    </Button>

                                    <Button variant="contained" onClick={() => submitStaffRemark("We are happy to hear that!")}
                                    >
                                        We are happy to hear that!
                                    </Button>
                                </React.Fragment>
                            )}

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
        </Box>
    )
}

export default EditRatingsAndReviews