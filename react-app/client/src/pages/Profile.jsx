import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Card, CardContent,IconButton, Avatar,Button } from '@mui/material';
import { AccountCircle, AccessTime, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import http from '../http';
import { Link } from 'react-router-dom';

function UserProfile() {
    const [userProfile, setUserProfile] = useState(null);
    const { user } = useContext(UserContext);

    const getUserProfile = () => {
        if (user) {
            http.get(`/user/${user.id}`).then((res) => {
                setUserProfile(res.data);
            });
        }
    };

    useEffect(() => {
        getUserProfile();
    }, [user]);

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                User Profile
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>

                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/changepassword" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Change Password
                            </Button>
                        </Link>
                    )
                }
            </Box>

            {userProfile ? (
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                        <Avatar
                                alt="Profile Picture"
                                src={`${import.meta.env.VITE_FILE_BASE_URL}${userProfile.imageFile}`}
                                sx={{ width: 60, height: 60, marginRight: 2, borderRadius: '50%' }}
                            />
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                Name: {userProfile.name}
                            </Typography>
                            <Link to={`/editprofile/${user.id}`}>
                                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                            <Typography>Email: {userProfile.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                            <Typography>Role: {userProfile.role}</Typography>
                        </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                <Typography>Phone Number: {userProfile.phoneNumber}</Typography>
                            </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                            <AccessTime sx={{ mr: 1 }} />
                            <Typography>
                                User since {dayjs(userProfile.createdAt).format('YYYY-MM-DD')}
                            </Typography>
                        </Box>
                        {/* Add more user-related information as needed */}
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1">Loading user profile...</Typography>
            )}
        </Box>
    );
}

export default UserProfile;
