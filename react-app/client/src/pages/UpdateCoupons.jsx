import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

function UpdateCoupons() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [userRole, setUserRole] = useState(null);

    const getUserProfile = () => {
        if (user) {
            http.get(`/user/${user.id}`).then((res) => {
                const userProfile = res.data;
                setUserRole(userProfile.role); 
            });
        }
    };

    useEffect(() => {
        getUserProfile();
    }, [user]);

    if (!user || user.role !== "admin") {
        return (
            <Typography variant="h5" sx={{ my: 2 }}>
                Access denied. Only admins can view this page.
            </Typography>
        );
    }

    const [coupons, setCoupons] = useState({
        couponName: "",
            discount: "",
            usage: "",
            valid: true,
            couponStatus: ""
    });

    useEffect(() => {
        http.get(`/Coupons/${id}`).then((res) => {
          setCoupons(res.data);
        });
      }, []);

    const formik = useFormik({
        initialValues: coupons,
        enableReinitialize: true,
        validationSchema: yup.object({
          couponName: yup.string().trim()
              .min(1, 'Coupon name must be at least 1 character')
              .max(25, 'Coupon name must be at most 50 characters')
              .matches(/^[a-zA-Z0-9]+$/, 'Coupon name can only contain letters and numbers')
              .required('Coupon name is required'),
          discount: yup
              .number()
              .typeError('Discount must be a number')
              .min(1, 'Discount should be at least 1')
              .max(100, 'Discount cannot exceed 100')
              .required('Discount is required'),
          usage: yup.number()
              .typeError("Usage must be a number")
              .min(1, 'Usage should be at least 1')
              .max(999, "Usage should not exceed 999")
              .required("Usage is required")
              .integer("Usage must be an integer"),
          couponStatus: yup.string().trim()
              .min(1, 'Coupon status must be at least 1 character')
              .max(50, 'Coupon status must be at most 50 characters')
              .matches(/^[a-zA-Z0-9]+$/, 'Coupon status can only contain letters and numbers')
              .required('Coupon status is required'),
      }),
      onSubmit: async (data) => {
        data.couponName = data.couponName.trim();
        data.usage = data.usage.trim();
    
        try {
            // Check for duplicate couponName
            const response = await http.get(`/Coupons/CheckDuplicateCouponName?couponName=${data.couponName}`);
    
            if (response.data.isDuplicate) {
                formik.setFieldError('couponName', 'Coupon with the same name already exists');
            } else {
                // No duplicate, proceed with the update
                await http.put(`/coupons/${id}`, data);
                navigate('/coupons');
            }
        } catch (error) {
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

    const deleteCoupons = () => {
        http.delete(`/coupons/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/coupons");
            });
    }


    return (
        <Box>
          <Typography variant="h5" sx={{ my: 2 }}>
            Update coupon
          </Typography> 
          <Box component="form" onSubmit={formik.handleSubmit}>
          <input type="hidden" name="valid" value={formik.values.valid} />
          <Grid container spacing={2}>
          <Grid item xs={6}>
          <TextField
            fullWidth margin="dense" autoComplete="on"
            label="Coupon Name"
            name="couponName"
            value={formik.values.couponName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.couponName && Boolean(formik.errors.couponName)}
            helperText={formik.touched.couponName && formik.errors.couponName}
        />
          </Grid>
          <Grid item xs={6}>
          <TextField
            fullWidth margin="dense" autoComplete="off"
            label="Discount"
            name="discount"
            value={formik.values.discount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.discount && Boolean(formik.errors.discount)}
            helperText={formik.touched.discount && formik.errors.discount}
          />
          </Grid>
          <Grid item xs={6}>
          <TextField
            fullWidth margin="dense" autoComplete="off"
            label="Usage"
            name="usage"
            value={formik.values.usage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.usage && Boolean(formik.errors.usage)}
            helperText={formik.touched.usage && formik.errors.usage}
            />
            </Grid>
            <Grid item xs={6}>
          <TextField
            fullWidth margin="dense" autoComplete="off"
            label="Coupon Status"
            name="couponStatus"
            value={formik.values.couponStatus}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.couponStatus && Boolean(formik.errors.couponStatus)}
            helperText={formik.touched.couponStatus && formik.errors.couponStatus}
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
                    Delete Coupon
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete this coupon?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteCoupons}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
    </Box>
    
  );
}

export default UpdateCoupons;