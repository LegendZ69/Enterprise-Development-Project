import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, RadioGroup, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { Discount } from '@mui/icons-material';

function AddCoupons() {
    const navigate = useNavigate();

    const formik = useFormik({
      initialValues: {
          couponName: "",
          discount: "",
          usage: "",
          valid: true,
          couponStatus: ""
      },
      validationSchema: yup.object({
        couponName: yup.string().trim()
            .min(1, 'Coupon name must be at least 1 character')
            .max(25, 'Coupon name must be at most 25 characters')
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
                // No duplicate, proceed with the submission
                await http.post('/Coupons', data);
                navigate('/coupons');
            }
        } catch (error) {
            console.error(error);
        }
    },
});


    return (
        <Box>
          <Typography variant="h5" sx={{ my: 2 }}>
            New coupon
          </Typography> 
          <Box component="form" onSubmit={formik.handleSubmit}>
          <input type="hidden" name="valid" value={formik.values.valid} />
          <Grid container spacing={2}>
          <Grid item xs={6}>
          <TextField
            fullWidth margin="dense" autoComplete="off"
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
            Add
          </Button>
        </Box>
        </Box>
    </Box>
  );
}

export default AddCoupons;