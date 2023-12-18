import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import { useParams } from 'react-router-dom';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditSuggestionForm() {
    const { id } = useParams();

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
            http.put(`/suggestionForm/${id}`, data)
                .then((res) => {
                    console.log(res.data);
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

    const deleteSuggestionForm = () => {
        http.delete(`/suggestionForm/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/suggestionForm");
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