import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditSuggestionForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [suggestionForm, setSuggestionForm] = useState({
        email: "",
        activityName: "",
        activityType: "",
        activityDescription: "",
        activityReason: ""
    });

    useEffect(() => {
        http.get(`/suggestionForm/${id}`).then((res) => {
            setSuggestionForm(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: suggestionForm,
        enableReinitialize: true,
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(100, 'Email must be at most 100 characters')
                .required('Email is required'),
            activityName: yup.string().trim()
                .min(3, 'Activity Name must be at least 3 characters')
                .max(50, 'Activity Name must be at most 50 characters')
                .required('Activity Name is required'),
            activityType: yup.string()
                .required('Activity Type is required'),
            activityDescription: yup.string().trim()
                .min(3, 'Activity Description must be at least 3 characters')
                .max(200, 'Activity Description must be at most 200 characters')
                .required('Activity Description is required'),
            activityReason: yup.string().trim()
                .min(3, 'Activity Reason must be at least 3 characters')
                .max(50, 'Activity Reason must be at most 50 characters')
                .required('Activity Reason is required'),
            staffRemark: yup.string().trim()
        }),

        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.activityName = data.activityName.trim();
            data.activityType = data.activityType;
            data.activityDescription = data.activityDescription.trim();
            data.activityReason = data.activityReason.trim();
            data.staffRemark = data.staffRemark.trim();
            http.put(`/suggestionForm/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/displaySuggestionForm");
                })
                .catch(function (err) {
                    console.log(err.response);
                });
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

    const deleteSuggestionForm = () => {
        http.delete(`/suggestionForm/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/displaySuggestionForm");
            })
            .catch(function (err) {
                console.log(err.response);
            });
    }

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Edit Suggestion Form
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>

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
                            label="Activity Name"
                            name="activityName"
                            value={formik.values.activityName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.activityName && Boolean(formik.errors.activityName)}
                            helperText={formik.touched.activityName && formik.errors.activityName}
                        />
                    </Grid>
                    <Grid item xs={6} sx={{ mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel id='activityType'>Activity Type</InputLabel>
                            <Select margin="dense" autoComplete="off"
                                label="Activity Type"
                                name="activityType"
                                value={formik.values.activityType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.activityType && Boolean(formik.errors.activityType)}
                                helperText={formik.touched.activityType && formik.errors.activityType}
                            >
                                <MenuItem value="Leisure and Entertainment">Leisure and Entertainment</MenuItem>
                                <MenuItem value="Sports and Adventure">Sports and Adventure</MenuItem>
                                <MenuItem value="Family and Friends">Family and Friends</MenuItem>
                                <MenuItem value="Others">Others</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="Activity Description"
                    name="activityDescription"
                    value={formik.values.activityDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.activityDescription && Boolean(formik.errors.activityDescription)}
                    helperText={formik.touched.activityDescription && formik.errors.activityDescription}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline
                    label="Activity Reason"
                    name="activityReason"
                    value={formik.values.activityReason}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.activityReason && Boolean(formik.errors.activityReason)}
                    helperText={formik.touched.activityReason && formik.errors.activityReason}
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

                <Button variant="contained" onClick={() => submitStaffRemark("Thanks for the suggestion! We will incorporate it in future.")}
                >
                    Thanks for the suggestion! We will incorporate it in future.
                </Button>

                <Button variant="contained" onClick={() => submitStaffRemark("Unfortunately, this suggestion is not feasible.")}
                >
                    Unfortunately, this suggestion is not feasible.
                </Button>

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
                    Delete Suggestion Form
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this suggestion form?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteSuggestionForm}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EditSuggestionForm