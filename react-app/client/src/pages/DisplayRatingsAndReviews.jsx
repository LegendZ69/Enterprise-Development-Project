import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Rating, Divider } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import UserContext from '../contexts/UserContext';

function DisplayRatingsAndReviews() {
    const [ratingsAndReviewsList, setRatingsAndReviewsList] = useState([]);
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

    const getRatingsAndReviews = () => {
        http.get('/ratingsAndReviews').then((res) => {
            setRatingsAndReviewsList(res.data);
        });
    };

    const searchRatingsAndReviews = () => {
        http.get(`/ratingsAndReviews?search=${search}`).then((res) => {
            setRatingsAndReviewsList(res.data);
        });
    };

    useEffect(() => {
        getRatingsAndReviews();
        getUserProfile();
    }, [user]);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchRatingsAndReviews();
        }
    };

    const onClickSearch = () => {
        searchRatingsAndReviews();
    };

    const onClickClear = () => {
        setSearch('');
        getRatingsAndReviews();
    };

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                My Review
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
                <Link to="/ratingsAndReviews" style={{ textDecoration: 'none' }}>
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
                        <Link to="/displayFeedbackForm"><Typography gutterBottom>My Feedback</Typography></Link>
                        <Link to="/displaySuggestionForm"><Typography gutterBottom>My Suggestion</Typography></Link>
                        <Link to="/displayRatingsAndReviews"><Typography sx={{ fontWeight: 'bold' }}>My Reviews</Typography></Link>
                    </Box>

                    <Divider sx={{ border: '1px solid grey' }} />

                    {/* Right Side */}
                    <Box flex={3} marginLeft={2}>
                        {
                            user && ratingsAndReviewsList.map((ratingsAndReviews, i) => {
                                return (
                                    user.id === ratingsAndReviews.userId && (
                                        <Grid item xs={12} md={6} lg={4} key={ratingsAndReviews.id}>
                                            <Card>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <AccountCircle />
                                                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', whiteSpace: 'pre-wrap', mr: 1 }}>
                                                            {ratingsAndReviews.user?.name} ({ratingsAndReviews.email})
                                                        </Typography>
                                                        <Link to={`/editRatingsAndReviews/${ratingsAndReviews.id}`}>
                                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                                <Edit />
                                                            </IconButton>
                                                        </Link>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                                        <AccessTime fontSize='small' />
                                                        <Typography variant='body2'>
                                                            {dayjs(ratingsAndReviews.createdAt).format(global.datetimeFormat)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', mb: 1 }} color="text.secondary">
                                                        <Rating value={ratingsAndReviews.rating} readOnly />
                                                    </Box>
                                                    <Typography gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
                                                        {ratingsAndReviews.review}
                                                    </Typography>
                                                    {
                                                        ratingsAndReviews.imageFile && (
                                                            <Box className="aspect-ratio-container">
                                                                <img alt="Reviews Photo" src={`${import.meta.env.VITE_FILE_BASE_URL}${ratingsAndReviews.imageFile}`}></img>
                                                            </Box>
                                                        )
                                                    }
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
                <Typography sx={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }} color={'error'}>An error occured. Please try again...</Typography>)
            }
        </Box>
    )
}

export default DisplayRatingsAndReviews