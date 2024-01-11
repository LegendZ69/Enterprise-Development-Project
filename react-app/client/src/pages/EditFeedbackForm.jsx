import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditFeedbackForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [feedbackForm, setFeedbackForm] = useState({
        // email: user.email, //merge with user.id
        email: "", //delete this after
        firstName: "",
        lastName: "",
        topic: "",
        message: ""
    });

    useEffect(() => {
        http.get(`/feedbackForm/${id}`).then((res) => {
            setFeedbackForm(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: feedbackForm,
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
            topic: yup.string()
                .required('Topic is required'),
            message: yup.string().trim()
                .min(3, 'Message must be at least 3 characters')
                .max(200, 'Message must be at most 200 characters')
                .required('Message is required'),
            staffRemark: yup.string().trim()
        }),

        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.topic = data.topic;
            data.message = data.message.trim();
            data.staffRemark = data.staffRemark.trim();
            http.put(`/feedbackForm/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/displayFeedbackForm");
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

    const deleteFeedbackForm = () => {
        http.delete(`/feedbackForm/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/displayFeedbackForm");
            })
            .catch(function (err) {
                console.log(err.response);
            });
    }

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Edit Feedback Form
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit} mt={15}>
                {/* remove email field, only allow signed in user to suggest / review */}
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
                    Delete Feedback Form
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this feedback form?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteFeedbackForm}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EditFeedbackForm