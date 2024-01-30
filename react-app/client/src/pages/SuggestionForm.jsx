import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Box, Typography, Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import StaffContext from '../contexts/StaffContext';
// import UserContext from '../contexts/UserContext';

function SuggestionForm() {
    const navigate = useNavigate();

    //add form as user/staff
    // const { staff } = useContext(StaffContext);
    // const { user } = useContext(UserContext);

    const formik = useFormik({
        // initialValues: user //if signed in as user, autofill fields with user info
        //     ? {
        //         // email: user.email, //merge with user.id
        // activityName: "",
        // activityType: "",
        // activityDescription: "",
        // activityReason: ""
        //     }
        //     : staff
        //         ? {
        //             // email: staff.email, //merge with user.id
        // activityName: "",
        // activityType: "",
        // activityDescription: "",
        // activityReason: ""
        //         }
        //         : {
        // email: "",
        // activityName: "",
        // activityType: "",
        // activityDescription: "",
        // activityReason: ""
        //         },
        
        initialValues: {
            // email: user.email, //merge with user.id
            email: "", //delete this after
            activityName: "",
            activityType: "",
            activityDescription: "",
            activityReason: ""
        },

        validationSchema: yup.object({
            //refer to edp ass
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
                .required('Activity Reason is required')
        }),

        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.activityName = data.activityName.trim();
            data.activityType = data.activityType;
            data.activityDescription = data.activityDescription.trim();
            data.activityReason = data.activityReason.trim();

            //if AccessToken is staff, post form as staff else user
            // if (localStorage.getItem("staffAccessToken")) {
            //     http.post("/contactUsForm/staff", data)
            //         .then((res) => {
            //             console.log(res.data);
            //             navigate("/formSuccess");
            //         })
            //         .catch(function (err) {
            //             toast.error(`${err.response.data.message}`);
            //         });
            // } else if (localStorage.getItem("userAccessToken")) {
            //     http.post("/contactUsForm/user", data)
            //         .then((res) => {
            //             console.log(res.data);
            //             navigate("/formSuccess");
            //         })
            //         .catch(function (err) {
            //             toast.error(`${err.response.data.message}`);
            //         });
            // };

            //delete this after merge
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

            <Box component="form" onSubmit={formik.handleSubmit}>

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
        </Box>
    )
}

export default SuggestionForm