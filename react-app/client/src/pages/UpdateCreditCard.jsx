import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

function UpdateCreditCard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    
    if (!user) {
        return (
            <Typography variant="h5" sx={{ my: 2 }}>
                Access denied. Only users can view this page.
            </Typography>
        );
    }
    const [creditCard, setCreditCard] = useState({
        cardNumber: "",
        firstName: "",
        lastName: "",
        city: "",
        address: ""
    });
    useEffect(() => {
        http.get(`/creditcard/${id}`).then((res) => {
            setCreditCard(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: creditCard,
        enableReinitialize: true,
        validationSchema: yup.object({
            cardNumber: yup.string()
                .required('Card number is required')
                .matches(/^\d{16}$/, 'Card number must be exactly 16 digits'),
            firstName: yup.string()
                .required('First name is required')
                .matches(/^[a-zA-Z ]*$/, 'First name can only contain letters and spaces'),
            lastName: yup.string()
                .required('Last name is required')
                .matches(/^[a-zA-Z ]*$/, 'Last name can only contain letters and spaces'),
            city: yup.string()
                .required('City is required')
                .matches(/^[a-zA-Z ]*$/, 'City can only contain letters and spaces'),
            address: yup.string()
                .required('Address is required')
                .matches(/^[a-zA-Z0-9 ]*$/, 'Address can only contain letters, numbers, and spaces')
        }),
        onSubmit: async (data) => {
            try {
                // Trim input values
                data.cardNumber = data.cardNumber.trim();
                data.firstName = data.firstName.trim();
                data.lastName = data.lastName.trim();
                data.city = data.city.trim();
                data.address = data.address.trim();

                const response = await http.post('/creditcard', data);

                // Handle success response
                console.log(response.data);
                navigate('/creditcard'); // Navigate to success page or any other page

            } catch (error) {
                // Handle error response
                console.error(error);
            }
        },
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteCreditCard = () => {
        http.delete(`/creditcard/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/creditcard");
            });
    }
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Update credit card
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <input type="hidden" name="valid" value={formik.values.valid} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Card Number"
                            name="cardNumber"
                            value={formik.values.cardNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                            helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
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
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            helperText={formik.touched.city && formik.errors.city}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                    </Grid>
                </Grid>

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
                    Delete Credit Card
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete this credit card?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteCreditCard}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

    );
}

export default UpdateCreditCard;
