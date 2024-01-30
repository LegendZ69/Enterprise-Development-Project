import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Rating } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function DisplayRatingsAndReviews() {
    const [ratingsAndReviewsList, setRatingsAndReviewsList] = useState([]);
    const [search, setSearch] = useState('');

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
    }, []);

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
                Display Ratings And Reviews
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

            <Grid container spacing={2}>
                {
                    ratingsAndReviewsList.map((ratingsAndReviews, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={ratingsAndReviews.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex' }}>

                                            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                                                {ratingsAndReviews.firstName} {ratingsAndReviews.lastName}
                                            </Typography>

                                            <Link to={`/editRatingsAndReviews/${ratingsAndReviews.id}`}>
                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>

                                        </Box>

                                        <Box sx={{ display: 'flex', mb: 1 }} color="text.secondary">
                                            <Rating value={ratingsAndReviews.rating} readOnly />
                                            <AccessTime fontSize='small' />
                                            <Typography variant='body2'>
                                                {dayjs(ratingsAndReviews.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>

                                        <Typography gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
                                            {ratingsAndReviews.review}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    )
}

export default DisplayRatingsAndReviews