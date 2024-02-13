import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Divider } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';

function DisplaySuggestionForm() {
    const [suggestionFormList, setSuggestionFormList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getSuggestionForms = () => {
        http.get('/suggestionForm').then((res) => {
            setSuggestionFormList(res.data);
        });
    };

    const searchSuggestionForms = () => {
        http.get(`/suggestionForm?search=${search}`).then((res) => {
            setSuggestionFormList(res.data);
        });
    };

    useEffect(() => {
        getSuggestionForms();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchSuggestionForms();
        }
    };

    const onClickSearch = () => {
        searchSuggestionForms();
    };

    const onClickClear = () => {
        setSearch('');
        getSuggestionForms();
    };

    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                {user.role === 'admin' ? 'Suggestions Dashboard' : 'My Suggestions'}
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
                <Link to="/suggestionForm" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add
                    </Button>
                </Link>
            </Box>

            {
                user.role == "user" && suggestionFormList.map((suggestionForm, i) => {
                    return (
                        user.id === suggestionForm.userId && (
                            <Grid item xs={12} md={6} lg={4} key={suggestionForm.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex' }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                                                {suggestionForm.activityName} - {suggestionForm.activityType}
                                            </Typography>

                                            <Link to={`/editSuggestionForm/${suggestionForm.id}`}>
                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <AccountCircle />
                                            <Typography sx={{ mr: 1 }}>
                                                {suggestionForm.user?.name} ({suggestionForm.email})
                                            </Typography>
                                            <AccessTime fontSize='small' />
                                            <Typography variant='body2'>
                                                {dayjs(suggestionForm.createdAt).format(global.datetimeFormat)}
                                            </Typography>
                                        </Box>

                                        <Typography gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
                                            {suggestionForm.activityDescription}
                                        </Typography>

                                        <Typography variant='body3' sx={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
                                            Reason:
                                        </Typography>
                                        <Typography gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
                                            {suggestionForm.activityReason}
                                        </Typography>

                                        <Typography variant='h7' sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary', fontWeight: 'bold' }}>
                                            Staff Remarks:
                                        </Typography>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                            {suggestionForm.staffRemark}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    );
                })
            }

            {
                user.role == "admin" && (
                    <Grid container spacing={2}>
                        {
                            suggestionFormList.map((suggestionForm, i) => (
                                <Grid item xs={12} md={6} lg={4} key={suggestionForm.id}>
                                    <Card>
                                        <CardContent>

                                            <Box sx={{ display: 'flex' }}>
                                                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                                                    {suggestionForm.activityName} - {suggestionForm.activityType}
                                                </Typography>

                                                <Link to={`/editSuggestionForm/${suggestionForm.id}`}>
                                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                                <AccountCircle />
                                                <Typography sx={{ mr: 1 }}>
                                                    {suggestionForm.user?.name} ({suggestionForm.email})
                                                </Typography>
                                                <AccessTime fontSize='small' />
                                                <Typography variant='body2'>
                                                    {dayjs(suggestionForm.createdAt).format(global.datetimeFormat)}
                                                </Typography>
                                            </Box>

                                            <Typography gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
                                                {suggestionForm.activityDescription}
                                            </Typography>

                                            <Typography variant='body3' sx={{ whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
                                                Reason:
                                            </Typography>
                                            <Typography gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
                                                {suggestionForm.activityReason}
                                            </Typography>

                                            <Typography variant='h7' sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary', fontWeight: 'bold' }}>
                                                Staff Remarks:
                                            </Typography>
                                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                                {suggestionForm.staffRemark}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                )}
        </Box>
    )
}

export default DisplaySuggestionForm