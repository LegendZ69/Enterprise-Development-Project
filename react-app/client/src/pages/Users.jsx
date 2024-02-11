import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Avatar } from '@mui/material';
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
    const [open, setOpen] = useState(false);
    const [reloadFlag, setReloadFlag] = useState(false); // State variable to trigger reload
    const [popDialogOpen, setPopDialogOpen] = useState(false); // State variable to control the population dialog
    const [numAdminsToPopulate, setNumAdminsToPopulate] = useState(0); // State variable to store the number of admins to populate
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== "admin") {
            return; // Exit early if user is not an admin
        }

        getUsers(); // Fetch users when component mounts
    }, [user, reloadFlag]); // Include 'reloadFlag' in dependencies

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getUsers = () => {
        const fetchUsers = search ? http.get(`/user/users?search=${search}`) : http.get('/user/users');
        fetchUsers.then((res) => {
            setUserList(res.data);
        });
    };

    const searchUsers = () => {
        getUsers(); // Trigger fetch when search term changes
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchUsers();
        }
    };

    const onClickSearch = () => {
        searchUsers();
    };

    const onClickClear = () => {
        setSearch('');
        getUsers(); // Reset search and fetch all users
    };

    const handleOpen = (user) => {
        setOpen(true);
        setSelectedUser(user); // Set the selected user when opening the dialog
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteActivity = () => {
        if (!selectedUser) {
            console.error("No user selected for deletion.");
            handleClose();
            return;
        }

        http.delete(`/user/${selectedUser.id}/${user.id}`)
            .then((res) => {
                console.log(res.data);

                if (selectedUser.id === user.id) {
                    logout(); // Logout if current user is deleted
                } else {
                    setReloadFlag(!reloadFlag); // Trigger reload after deletion
                }
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            })
            .finally(() => {
                handleClose(); // Close dialog
            });
    };

    const logout = () => {
        localStorage.clear();
        window.location = "/"; // Redirect to login page after logout
    };

    const populateAdminAccounts = () => {
        setPopDialogOpen(true); // Open the dialog for populating admin accounts
    };

    const handlePopDialogClose = () => {
        setPopDialogOpen(false); // Close the dialog for populating admin accounts
    };

    const handlePopulateAdmins = () => {
        // Make an HTTP request to populate admin accounts with the specified number
        // You can implement this according to your server API
        const url = numAdminsToPopulate ? `/user/populateadminaccs?numberOfAccounts=${numAdminsToPopulate}` : '/user/populateadminaccs';
        http.post(url)
            .then((res) => {
                // Check if the request was successful before reloading the page
                if (res.status === 200) {
                    window.location.reload(); // Reload the page
                }
            })
            .catch((error) => {
                console.error("Error populating admin accounts:", error);
            });
        setPopDialogOpen(false); // Close the dialog for populating admin accounts
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
                <Button variant="contained" sx={{ ml: 2 }} onClick={populateAdminAccounts}>
                    Populate Admin
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                {
                    // Add any user-related actions or buttons here
                }
            </Box>

            <Grid container spacing={2}>
                {userList.map((user) => (
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
                                        <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={() => handleOpen(user)}>
                                            Delete
                                        </Button>
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary">
                                    <AccountCircle sx={{ mr: 1 }} />
                                    <Typography>
                                        {user.email}
                                    </Typography>
                                </Box>
                                {/* Display additional user information here */}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

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

            <Dialog open={popDialogOpen} onClose={handlePopDialogClose}>
                <DialogTitle>Populate Admin Accounts</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the number of admin accounts to be populated:
                    </DialogContentText>
                    <Input type="number" value={numAdminsToPopulate} onChange={(e) => setNumAdminsToPopulate(parseInt(e.target.value))} />
                </DialogContent>
                <DialogActions>
                <Button onClick={handlePopulateAdmins} color="primary">
                        Populate
                    </Button>
                    <Button onClick={handlePopDialogClose} color="primary">
                        Cancel
                    </Button>
                    
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Users;
