import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,Avatar } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Users() {
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getUsers = () => {
        http.get('/user/users').then((res) => {
            setUserList(res.data);
        });
    };

    const searchUsers = () => {
        http.get(`/user/users?search=${search}`).then((res) => {
            setUserList(res.data);
        });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchUsers();
        }
    };

    const onClickSearch = () => {
        searchUsers();
    }

    const onClickClear = () => {
        setSearch('');
        getUsers();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Users
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
                {
                    // You can add any user-related actions or buttons here
                }
            </Box>

            <Grid container spacing={2}>
                {
                    userList.map((user, i) => (
                        <Grid item xs={12} md={6} lg={4} key={user.id}>
                            <Card>
                                
                                <CardContent>
                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Avatar
                                    alt="Profile Picture"
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${user.imageFile}`}
                                    sx={{ width: 60, height: 60, marginRight: 2, borderRadius: '50%' }}
                                />
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                            {user.name}
                                        </Typography>
                                        {/* You can add user-related actions or buttons here */
                                        
                                        }
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                        color="text.secondary">
                                        <AccountCircle sx={{ mr: 1 }} />
                                        <Typography>
                                            {user.email}
                                        </Typography>
                                    </Box>
                                    {/* You can display additional user information here */}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
}

export default Users;
