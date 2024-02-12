import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Switch from '@mui/material/Switch';

function EditProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: ""
        // Add other user properties as needed
    });

    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [userStatus, setUserStatus] = useState('activated'); // Initially set to 'activated'
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    useEffect(() => {
        http.get(`/user/${id}`).then((res) => {
            setUser(res.data);
            setImageFile(res.data.imageFile)
            setTwoFactorEnabled(res.data.twoFactorEnabled || false);

            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required'),
            email: yup.string().trim()
                .email('Invalid email address')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            phoneNumber: yup.string().trim()
                .matches(/^\d{8}$/, 'Phone number must be 8 digits')
                .required('Phone number is required'),
            // Add other validations for additional user properties
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.phoneNumber = data.phoneNumber.trim();
            data.status = userStatus; // Set user status
            data.twoFactorEnabled = twoFactorEnabled; // Set two factor enabled

            // Check if the email is updated
            const isEmailUpdated = data.email !== user.email;

            http.put(`/user/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    
                    if(isEmailUpdated){
                        logout()
                    } else {
                        if (userStatus === 'deactivated') {
                            logout(); // Logout if status is 'deactivated'
                        } else {
                            navigate("/profile");
                        }
                    }
                });
        }
    });

    const logout = () => {
        localStorage.clear();
        window.location = "/";
    };

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
                Edit User
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
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
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                />
                                {/* Add switch below the phone number */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <Typography variant="body1">Status:</Typography>
                                        <Switch
                                            checked={userStatus === 'activated'}
                                            onChange={() => setUserStatus(userStatus === 'activated' ? 'deactivated' : 'activated')}
                                            inputProps={{ 'aria-label': 'toggle user status' }}
                                        />
                                        {userStatus === 'activated' ? 'Activated' : 'Deactivated'}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <Typography variant="body1">Two-Factor Authentication:</Typography>
                                        <Switch
                                            checked={twoFactorEnabled}
                                            onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                            inputProps={{ 'aria-label': 'toggle two factor authentication' }}
                                        />
                                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                    </Box>
                                {/* Add additional fields as needed */}
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
                                                <img alt="tutorial"
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
                        </Box>
                    </Box>
                )
            }

            <ToastContainer />
        </Box>
    );
}

export default EditProfile;
