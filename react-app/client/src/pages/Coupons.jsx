import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, Cancel, Delete } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Coupons() {
    const [couponList, setCouponList] = useState([]);
    const [search, setSearch] = useState('');
    const [couponDelete, setCouponDelete] = useState(null);
    const { user } = useContext(UserContext);
    const [userRole, setUserRole] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (user) {
            http.get(`/user/${user.id}`).then((res) => {
                const userProfile = res.data;
                setUserRole(userProfile.role);
            });

            getCoupons();
        }
    }, [user]);

    const getCoupons = () => {
        http.get('/coupons').then((res) => {
            setCouponList(res.data);
        });
    };

    const handleOpen = (coupon) => {
        setCouponDelete(coupon);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteCoupon = () => {
        if (couponDelete) {
            http.delete(`/coupons/${couponDelete.id}`)
                .then((res) => {
                    console.log(res.data);
                    setCouponDelete(null);
                    setOpen(false);
                    getCoupons();
                });
        }
    };

    if (!user || user.role !== "admin") {
        return (
            <Typography variant="h5" sx={{ my: 2 }}>
                Access denied. Only admins can view this page.
            </Typography>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Coupons
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/addCoupons" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>Add a coupon</Button>
                </Link>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Coupon Name</TableCell>
                            <TableCell>Discount Price</TableCell>
                            <TableCell>Total Usage</TableCell>
                            <TableCell>Coupon Valid</TableCell>
                            <TableCell>Coupon Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {couponList.map((coupon) => (
                            <TableRow key={coupon.id}>
                                <TableCell>{coupon.couponName}</TableCell>
                                <TableCell>${coupon.discount}</TableCell>
                                <TableCell>{coupon.usage}</TableCell>
                                <TableCell>{coupon.valid ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{coupon.couponStatus}</TableCell>
                                <TableCell>
                                    <Link to={`/updateCoupons/${coupon.id}`}>
                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                    <IconButton color="error" onClick={() => handleOpen(coupon)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Coupon</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to delete this coupon?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={deleteCoupon}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Coupons;
