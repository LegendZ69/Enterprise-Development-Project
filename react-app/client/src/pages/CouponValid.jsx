import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

function CouponsValid() {
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
            valid: "",
    });
    
    useEffect(() => {
        http.get(`/coupons/${id}`).then((res) => {
            setCoupons(res.data);
        });
    }, []);
    const formik = useFormik({
        initialValues: coupons,
        enableReinitialize: true,
        validationSchema: yup.object({
          valid: yup.string().required('Please pick an option'),
    }),
    onSubmit: (data) => { 
      const updatedData = { valid: data.valid === 'true' };
      http.put(`/coupons/${id}`, updatedData)
        .then((res) => {
          console.log(res.data);
          navigate("/coupons");
        })
        .catch((error) => {
          console.error("Error updating coupon validity:", error);
        });
    },
    
    });

    return (
        <Box>
          <Typography variant="h5" sx={{ my: 2 }}>
            Make coupon not valid
          </Typography> 
          <Box component="form" onSubmit={formik.handleSubmit}>
          <RadioGroup
          name="valid"
          value={formik.values.valid.toString()}
          onChange={formik.handleChange}
        >
          <FormControlLabel value="true" control={<Radio />} label="Coupon is valid" />
          <FormControlLabel value="false" control={<Radio />} label="Coupon is not valid" />
        </RadioGroup>
        {formik.errors.valid && formik.touched.valid && (
          <div style={{ color: 'red' }}>{formik.errors.valid}</div>
        )}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </Box>
        </Box>

    </Box>
    
  );
}

export default CouponsValid;