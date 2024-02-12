import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Divider } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';

function DisplayFeedbackForm() {
    const [feedbackFormList, setFeedbackFormList] = useState([]);
    const [search, setSearch] = useState('');

    //add form as user/staff
    // const { staff } = useContext(StaffContext);
    const { user } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState(null);

    const getUserProfile = () => {
        if (user) {
            http.get(`/user/${user.id}`).then((res) => {
                setUserProfile(res.data);
            });
        }
    };

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getFeedbackForms = () => {
        http.get('/feedbackForm').then((res) => {
            setFeedbackFormList(res.data);
        });
    };

    const searchFeedbackForms = () => {
        http.get(`/feedbackForm?search=${search}`).then((res) => {
            setFeedbackFormList(res.data);
        });
    };

    useEffect(() => {
        getFeedbackForms();
        getUserProfile();
    }, [user]);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchFeedbackForms();
        }
    };

    const onClickSearch = () => {
        searchFeedbackForms();
    };

    const onClickClear = () => {
        setSearch('');
        getFeedbackForms();
    };

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                My Feedback
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
                <Link to="/feedbackForm" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add
                    </Button>
                </Link>
            </Box>

            {userProfile && user.role == "user" ? (
                <Box display="flex">
                    {/* Left Side */}
                    <Box flex={1} sx={{ alignContent: 'center', textAlign: 'center' }}>
                        <Link to="/profile"><Typography sx={{ textDecoration: 'none' }} gutterBottom>Profile</Typography></Link>
                        <Link to="/displayFeedbackForm"><Typography sx={{ fontWeight: 'bold' }} gutterBottom>My Feedback</Typography></Link>
                        <Link to="/displaySuggestionForm"><Typography gutterBottom>My Suggestion</Typography></Link>
                        <Link to="/displayRatingsAndReviews"><Typography>My Reviews</Typography></Link>
                    </Box>

                    <Divider sx={{ border: '1px solid grey' }} />

                    {/* Right Side */}
                    <Box flex={3} marginLeft={2}>
                        {
                            user && feedbackFormList.map((feedbackForm, i) => {
                                return (
                                    user.id === feedbackForm.userId && (
                                        <Grid item xs={12} md={6} lg={4} key={feedbackForm.id}>
                                            <Card>
                                                <CardContent>

                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                                                            {feedbackForm.topic}
                                                        </Typography>

                                                        <Link to={`/editFeedbackForm/${feedbackForm.id}`}>
                                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                                <Edit />
                                                            </IconButton>
                                                        </Link>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                                        color="text.secondary">
                                                            <AccountCircle />
                                                            <Typography sx={{ mr: 1 }}>
                                                                {feedbackForm.user?.name} ({feedbackForm.email})
                                                            </Typography>

                                                        <AccessTime fontSize='small' />
                                                        <Typography variant='body2'>
                                                            {dayjs(feedbackForm.createdAt).format(global.datetimeFormat)}
                                                        </Typography>
                                                    </Box>

                                                    <Typography gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
                                                        {feedbackForm.message}
                                                    </Typography>

                                                    <Typography variant='h7' sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary', fontWeight: 'bold' }}>
                                                        Staff Remarks:
                                                    </Typography>
                                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                                        {feedbackForm.staffRemark}
                                                    </Typography>

                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                );
                            })
                        }
                    </Box>
                </Box>
            ) : (
                <Typography sx={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }} color={'error'}>An error occured. Please try again...</Typography>
            )}
        </Box>
    )
}

export default DisplayFeedbackForm