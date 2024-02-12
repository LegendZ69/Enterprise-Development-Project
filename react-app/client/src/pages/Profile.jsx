import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Avatar, Button, Divider } from '@mui/material';
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
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Profile
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

            {userProfile && user.role == "user" ? (
                <Box display="flex">
                    {/* Left Side */}
                    <Box flex={1} sx={{ alignContent: 'center', textAlign: 'center' }}>
                        <Link to="/profile"><Typography sx={{ fontWeight: 'bold' }} gutterBottom>Profile</Typography></Link>
                        <Link to="/displayFeedbackForm"><Typography gutterBottom>My Feedback</Typography></Link>
                        <Link to="/displaySuggestionForm"><Typography gutterBottom>My Suggestion</Typography></Link>
                        <Link to="/displayRatingsAndReviews"><Typography>My Reviews</Typography></Link>
                    </Box>

                    <Divider sx={{ border: '1px solid grey' }} />

                    {/* Right Side */}
                    <Box flex={3} marginLeft={2}>
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
                                        Member since {dayjs(userProfile.createdAt).format('YYYY-MM-DD')}
                                    </Typography>
                                </Box>
                                {/* Add more user-related information as needed */}
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            ) : (
                userProfile && user.role === "admin" ? (
                        <Box display="flex">
                            {/* Left Side */}
                            <Box flex={1} sx={{ alignContent: 'center', textAlign: 'center' }}>
                                <Link to="/profile"><Typography sx={{ fontWeight: 'bold' }} gutterBottom>Profile</Typography></Link>
                                <Link to="/adminDisplayFeedbackForm"><Typography gutterBottom>Admin Feedback</Typography></Link>
                                <Link to="/adminDisplaySuggestionForm"><Typography gutterBottom>Admin Suggestion</Typography></Link>
                                <Link to="/adminDisplayRatingsAndReviews"><Typography>Admin Reviews</Typography></Link>
                            </Box>

                            <Divider sx={{ border: '1px solid grey' }} />

                            {/* Right Side */}
                            <Box flex={3} marginLeft={2}>
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
                                                Member since {dayjs(userProfile.createdAt).format('YYYY-MM-DD')}
                                            </Typography>
                                        </Box>
                                        {/* Add more user-related information as needed */}
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                ) : (
                    <Typography variant="body1">Loading user profile...</Typography>
                )
            )}
        </Box>
    );
}

export default UserProfile;
