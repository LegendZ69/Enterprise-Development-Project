import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

function EditFeedbackForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [feedbackForm, setFeedbackForm] = useState({
        topic: "",
        message: "",
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
            topic: yup.string()
                .required('Topic is required'),
            message: yup.string().trim()
                .min(3, 'Message must be at least 3 characters')
                .max(200, 'Message must be at most 200 characters')
                .required('Message is required'),
        }),

        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.firstName = data.firstName.trim();
            data.lastName = data.lastName.trim();
            data.topic = data.topic;
            data.message = data.message.trim();

            if (user.role == "user") {
                http.put(`/feedbackForm/${id}`, data)
                    .then((res) => {
                        console.log(res.data);
                        navigate("/displayFeedbackForm");
                    })
                    .catch(function (err) {
                        console.log(err.response);
                    });
            } else if (user.role == "admin") {
                http.put(`/feedbackForm/admin/${id}`, data)
                    .then((res) => {
                        console.log(res.data);
                        navigate("/adminDisplayFeedbackForm");
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

    const deleteFeedbackForm = () => {
        if (user.role == "user") {
            http.delete(`/feedbackForm/${id}`)
                .then((res) => {
                    console.log(res.data);
                    navigate("/displayFeedbackForm");
                })
                .catch(function (err) {
                    console.log(err.response);
                });
        }
        else if (user.role == "admin") {
            http.delete(`/feedbackForm/admin/${id}`)
                .then((res) => {
                    console.log(res.data);
                    navigate("/adminDisplayFeedbackForm");
                })
                .catch(function (err) {
                    console.log(err.response);
                });
        }
    }

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Edit Feedback Form
            </Typography>

            {
                user && (
                    <Box>
                        <Box component="form" onSubmit={formik.handleSubmit} mt={15}>
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

                                    <Button variant="contained" onClick={() => submitStaffRemark("Thanks for the feedback!")}
                                    >
                                        Thanks for the feedback!
                                    </Button>

                                    <Button variant="contained" onClick={() => submitStaffRemark("We apologize for the inconvenience caused.")}
                                    >
                                        We apologize for the inconvenience caused.
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
        </Box>
    )
}

export default EditFeedbackForm