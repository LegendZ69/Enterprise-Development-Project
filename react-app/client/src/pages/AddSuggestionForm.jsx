import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Box, Typography, Button, TextField } from '@mui/material';

function AddSuggestionForm() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "", //merge with user.id
            activityName: "",
            activityType: "",
            activityDescription: "",
            activityReason: ""
        },

        validationSchema: yup.object({
            //refer to edp ass
            email: yup.string().trim()
                .min(3, 'Email must be at least 3 characters')
                .max(100, 'Email must be at most 100 characters')
                .required('Email is required'),
            activityName: yup.string().trim()
                .min(3, 'Activity Name must be at least 3 characters')
                .max(50, 'Activity Name must be at most 50 characters')
                .required('Activity Name is required'),
            activityType: yup.string().trim() //change to dropdown menu, no need trim
                .min(3, 'Activity Type must be at least 3 characters')
                .max(500, 'Activity Type must be at most 500 characters')
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
            data.email = data.email.trim();
            data.activityName = data.activityName.trim();
            data.activityType = data.activityType.trim();
            data.activityDescription = data.activityDescription.trim();
            data.activityReason = data.activityReason.trim();
            http.post("/suggestionForm", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/formSuccess");
                });
        }
    });

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Add Suggestion Form
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
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="Activity Type"
                    name="activityType"
                    value={formik.values.activityType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.activityType && Boolean(formik.errors.activityType)}
                    helperText={formik.touched.activityType && formik.errors.activityType}
                />
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
        </Box>
    )
}

export default AddSuggestionForm