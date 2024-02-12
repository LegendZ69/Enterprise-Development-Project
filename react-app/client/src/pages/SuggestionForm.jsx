import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import UserContext from '../contexts/UserContext';

function SuggestionForm() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const formik = useFormik({
        initialValues: user //if signed in as user, autofill fields with user info
            ? {
                email: user.email,
                activityName: "",
                activityType: "",
                activityDescription: "",
                activityReason: ""
            } : {
                email: "nomail@mail.com",
                activityName: "",
                activityType: "",
                activityDescription: "",
                activityReason: ""
            },

        validationSchema: yup.object({
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
                .required('Activity Reason is required')
        }),

        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.activityName = data.activityName.trim();
            data.activityType = data.activityType;
            data.activityDescription = data.activityDescription.trim();
            data.activityReason = data.activityReason.trim();
            http.post("/suggestionForm", data)
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
                Suggestion Form
            </Typography>

            {!user ? (
                <Typography variant="h6" sx={{ mt: 5, textAlign: 'center', fontWeight: 'bold' }}>
                    You must be logged in.
                </Typography>
            ) : (
                <Box component="form" onSubmit={formik.handleSubmit}>
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
                                <Select margin="dense"
                                    labelId='activityType'
                                    label="Activity Type"
                                    name="activityType"
                                    value={formik.values.activityType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.activityType && Boolean(formik.errors.activityType)}
                                    helperText={formik.touched.activityType && formik.errors.activityType}
                                >
                                    <MenuItem value="Leisure And Entertainment">Leisure and Entertainment</MenuItem>
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

export default SuggestionForm