import React, { useEffect, useState, useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,Avatar } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Users() {
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    if (!user || user.role !== "admin"){
        return (
            <Typography variant="h5" sx={{ my: 2 }}>
                Access denied. Only admins can view this page.
            </Typography>
        ); 
    }

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
    const [open, setOpen] = useState(false);

    const handleOpen = (user) => {
        setOpen(true);
        setSelectedUser(user); // Set the selected user when opening the dialog
    };

    const handleClose = () => {
        setOpen(false);
    };
    

    const deleteActivity = () => {
        if (!selectedUser) {
            // Handle the case where no user is selected
            console.error("No user selected for deletion.");
            handleClose();
            return;
        }
    
        http.delete(`/user/${selectedUser.id}/${user.id}`)
            .then((res) => {
                console.log(res.data);
    
                if (selectedUser.id === user.id) {
                    // If the current user is being deleted, perform logout
                    // Implement the logout function according to your application's logic
                    logout(); // Replace 'logout' with your actual logout function
                } else {
                    // If it's another user, navigate to the users' page
                    getUsers();
                }
            })
            .catch((error) => {
                // Handle errors here
                console.error("Error deleting user:", error);
            })
            .finally(() => {
                handleClose(); // Close the dialog regardless of success or failure
            });
    };
    
    
    const logout = () => {
        localStorage.clear();
        window.location = "/";
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
                                            <Button variant="contained" sx={{ ml: 2 }} color="error"  onClick={() => handleOpen(user)}>
                                                Delete
                                            </Button>
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
                <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Activity
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this activity?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteActivity}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            </Grid>
        </Box>
    );
}

export default Users;
