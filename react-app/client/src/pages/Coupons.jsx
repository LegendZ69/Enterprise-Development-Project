import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit, Cancel, Delete } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';

function Coupons() {
    const [couponList, setcouponList] = useState([]);
    const [search, setSearch] = useState('');
    const [couponDelete, setCouponDelete] = useState(null);
    const { user } = useContext(UserContext);
    const [userRole, setUserRole] = useState(null);
    
    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getCoupons = () => {
        http.get('/coupons').then((res) => {
            setcouponList(res.data);
        });
    };

    const searchCoupons = () => {
        http.get(`/coupons?search=${search}`).then((res) => {
            setcouponList(res.data);
        });
    };

    useEffect(() => {
        if (user) {
            http.get(`/user/${user.id}`).then((res) => {
                const userProfile = res.data;
                setUserRole(userProfile.role);
            });

            getCoupons();
        }
    }, [user]);

      


    if (!user || user.role !== "admin") {
        return (
            <Typography variant="h5" sx={{ my: 2 }}>
                Access denied. Only admins can view this page.
            </Typography>
        );
    }

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchCoupons();
        }
    };

    const onClickSearch = () => {
        searchCoupons();
    }

    const onClickClear = () => {
        setSearch('');
        getCoupons();
    };
    const [open, setOpen] = useState(false);

    const handleOpen = (coupons) => {
        setCouponDelete(coupons);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const deleteCoupons = () => {
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
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Coupons
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/addCoupons" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add a coupon
                    </Button>
                </Link>
            </Box>

            <Grid container spacing={2}>
                {
                    couponList.map((coupons, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={coupons.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {coupons.couponName}
                                            </Typography>
                                            {coupons.valid && (
                                                <Link to={`/validCoupon/${coupons.id}`} style={{ textDecoration: 'none' }}>
                                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                                        <Cancel />
                                                    </IconButton>
                                                </Link>
                                            )}
                                            {coupons.valid && (
                                                <Link to={`/updateCoupons/${coupons.id}`}>

                                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                            )}
                                            {!coupons.valid && (
                                                <IconButton color="primary" sx={{ padding: '4px' }} onClick={() => handleOpen(coupons)} >
                                                    <Delete />
                                                </IconButton>
                                            )}
                                        </Box>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Discount price: ${coupons.discount}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Total usage: {coupons.usage}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Coupon valid: {coupons.valid ? 'yes' : 'no'}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            Coupon status: {coupons.couponStatus}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
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

export default Coupons;