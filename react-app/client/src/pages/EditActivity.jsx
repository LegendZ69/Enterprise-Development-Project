import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, MenuItem } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditActivity() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState({
        title: "",
        description: "",
        price: "", 
        category: "",
        eventDate: "", // New field for event date
        location: "",  // New field for location
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/activity/${id}`).then((res) => {
            setActivity(res.data);
            setImageFile(res.data.imageFile);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: activity,
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            price: yup.number().min(0, 'Price must be greater than or equal to 0'),
            category: yup.string().required('Category is required'),
            eventDate: yup.date().required('Event date is required'), // New validation for event date
            location: yup.string().trim().required('Location is required'), // New validation for location
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();
            http.put(`/activity/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/activitiesDashboard");
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

    const deleteActivity = () => {
        http.delete(`/activity/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/activities");
            });
    }

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

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Activity
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={8}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Title"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helperText={formik.touched.price && formik.errors.price}
                                />
                                <TextField
                                    fullWidth
                                    select
                                    margin="dense"
                                    label="Category"
                                    name="category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.category && Boolean(formik.errors.category)}
                                    helperText={formik.touched.category && formik.errors.category}
                                >
                                    <MenuItem value="" disabled>
                                        Select a Category
                                    </MenuItem>
                                    <MenuItem value="sports">Sports</MenuItem>
                                    <MenuItem value="leisure">Leisure</MenuItem>
                                    <MenuItem value="family">Family</MenuItem>
                                </TextField>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Event Date"
                                    name="eventDate"
                                    type="date"
                                    value={formik.values.eventDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                                    helperText={formik.touched.eventDate && formik.errors.eventDate}
                                />
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Location"
                                    name="location"
                                    value={formik.values.location}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.location && Boolean(formik.errors.location)}
                                    helperText={formik.touched.location && formik.errors.location}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <Box sx={{ textAlign: 'center', mt: 2 }} >
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input hidden accept="image/*" multiple type="file"
                                            onChange={onFileChange} />
                                    </Button>
                                    {
                                        imageFile && (
                                            <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                                <img alt="activity"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Activity
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this activity?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteActivity}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
}

export default EditActivity;
