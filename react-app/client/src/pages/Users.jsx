import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Toolbar,
    Typography,
    Checkbox,
    IconButton,
    Tooltip,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Avatar,
    Input
  } from '@mui/material';
  import {
      MDBCol,
      MDBContainer,
      MDBRow,
      MDBCard,
      MDBCardText,
      MDBCardBody,
      MDBBtn,
      MDBBreadcrumb,
      MDBBreadcrumbItem,
      MDBIcon,
      MDBListGroup,
      MDBListGroupItem,
    } from "mdb-react-ui-kit";
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import { formatDistance } from 'date-fns';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import { toast } from 'react-toastify';

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
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        if (!user || user.role !== "admin") {
            return; // Exit early if user is not an admin
        }
        getUserProfile();
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
        getUsers(); 
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
                    // If the current user is being deleted, perform logout
                    // Implement the logout function according to your application's logic
                    logout(); // Replace 'logout' with your actual logout function
                } else {
                    // If it's another user, navigate to the users' page
                    setReloadFlag(!reloadFlag); // Trigger reload after deletion
                }
            })
            .catch((error) => {
                // Handle errors here
                console.error("Error deleting user:", error);
            })
            .finally(() => {
                handleClose(); // Close dialog
            });
    };
    
    const getUserProfile = () => {
        if (user) {
            http.get(`/user/${user.id}`).then((res) => {
                setUserProfile(res.data);
            });
        }
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
            if (numAdminsToPopulate < 0) {
                toast.error("Number of admin accounts to populate cannot be negative.");
                return; // Exit the function early if the number is negative
            }
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
        // <Box>
        //     <Typography variant="h5" sx={{ my: 2 }}>
        //         Users
        //     </Typography>

        //     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        //         <Input value={search} placeholder="Search"
        //             onChange={onSearchChange}
        //             onKeyDown={onSearchKeyDown} />
        //         <IconButton color="primary"
        //             onClick={onClickSearch}>
        //             <Search />
        //         </IconButton>
        //         <IconButton color="primary"
        //             onClick={onClickClear}>
        //             <Clear />
        //         </IconButton>
                // <Button variant="contained" sx={{ ml: 2 }} onClick={populateAdminAccounts}>
                //     Populate Admin
                // </Button>
        //         <Box sx={{ flexGrow: 1 }} />
        //         {
        //             // You can add any user-related actions or buttons here
        //         }
        //     </Box>

        //     <Grid container spacing={2}>
        //         {userList.map((user) => (
        //             <Grid item xs={12} md={6} lg={4} key={user.id}>
        //                 <Card>
        //                     <CardContent>
        //                         <Box sx={{ display: 'flex', mb: 1 }}>


        //                             <Avatar
        //                                 alt="Profile Picture"
        //                                 src={`${import.meta.env.VITE_FILE_BASE_URL}${user.imageFile}`}
        //                                 sx={{ width: 60, height: 60, marginRight: 2, borderRadius: '50%' }}
        //                             />
        //                             <Typography variant="h6" sx={{ flexGrow: 1 }}>
        //                                 Name: {user.name}
        //                                 <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={() => handleOpen(user)}>
        //                                     Delete
        //                                 </Button>
        //                             </Typography>
        //                         </Box>
        //                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
        //                             color="text.secondary">
        //                             <Typography>
        //                                 Email: {user.email}
        //                             </Typography>
        //                         </Box>
        //                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
        //                             color="text.secondary">
                                    
        //                             <Typography>
        //                                User Id: {user.id}
        //                             </Typography>
        //                         </Box>
        //                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
        //                             color="text.secondary">
                                    
        //                             <Typography>
        //                                Role: {user.role}
        //                             </Typography>
        //                         </Box>
        //                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
        //                             color="text.secondary">
                                    
        //                             <Typography>
        //                                User Status: {user.status}
        //                             </Typography>
        //                         </Box>
        //                         {/* Display additional user information here */}
        //                     </CardContent>
        //                 </Card>
        //             </Grid>
        //         ))}
        //     </Grid>

            // <Dialog open={open} onClose={handleClose}>
            //     <DialogTitle>
            //         Delete Activity
            //     </DialogTitle>
            //     <DialogContent>
            //         <DialogContentText>
            //             Are you sure you want to delete this activity?
            //         </DialogContentText>
            //     </DialogContent>
            //     <DialogActions>
            //         <Button variant="contained" color="inherit" onClick={handleClose}>
            //             Cancel
            //         </Button>
            //         <Button variant="contained" color="error" onClick={deleteActivity}>
            //             Delete
            //         </Button>
            //     </DialogActions>
            // </Dialog>

            // <Dialog open={popDialogOpen} onClose={handlePopDialogClose}>
            //     <DialogTitle>Populate Admin Accounts</DialogTitle>
            //     <DialogContent>
            //         <DialogContentText>
            //             Enter the number of admin accounts to be populated:
            //         </DialogContentText>
            //         <Input type="number" value={numAdminsToPopulate} onChange={(e) => setNumAdminsToPopulate(parseInt(e.target.value))} />
            //     </DialogContent>
            //     <DialogActions>
            //     <Button onClick={handlePopulateAdmins} color="primary">
            //             Populate
            //         </Button>
            //         <Button onClick={handlePopDialogClose} color="primary">
            //             Cancel
            //         </Button>
                    
            //     </DialogActions>
            // </Dialog>
        // </Box>
        <section>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol>
              <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                <MDBBreadcrumbItem>
                  <a href="/">Home</a>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>
                  <a href="/profile">User</a>
                </MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </MDBCol>
          </MDBRow>
          {userProfile ? (
            <MDBRow>
              <MDBCol lg="4">
                <MDBCard className="mb-4">
                  <MDBCardBody className="text-center">
                    <div className="d-flex justify-content-center mb-4">
                      <Avatar
                        alt="Profile Picture"
                        src={`${import.meta.env.VITE_FILE_BASE_URL}${
                          userProfile.imageFile
                        }`}
                        sx={{ width: 300, height: 300, borderRadius: "50%" }}
                      />
                    </div>
                    <p className="text-muted mb-1">Name: {userProfile.name}</p>
                    <p className="text-muted mb-1">Role: {userProfile.role}</p>
                    <p className="text-muted mb-1">
                      User Status: {userProfile.status}
                    </p>
                    <p className="text-muted mb-1">
                      User since{" "}
                      {dayjs(userProfile.createdAt).format("YYYY-MM-DD")}
                    </p>
  
                    <div className="d-flex justify-content-center mb-2">
                      <Link
                        to={`/editprofile/${user.id}`}
                        style={{ marginRight: "10px" }}
                      >
                        <MDBBtn>Edit Profile</MDBBtn>
                      </Link>
                      <Link
                        to="/changepassword"
                        style={{ marginRight: "10px", textDecoration: "none" }}
                      >
                        <MDBBtn>Change Password</MDBBtn>
                      </Link>
                    </div>
                  </MDBCardBody>
                </MDBCard>
  
                <MDBCard className="mb-4 mb-lg-0">
                  <MDBCardBody className="p-0">
                    <MDBListGroup flush className="rounded-3">
                      {user && user.role === "admin" && (
                        <>
                        <Link to={`/profile`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="chart-line" style={{ color: '#333333' }}/>
                        <MDBCardText>Profile</MDBCardText>
                    </MDBListGroupItem>
                    </Link>

                <Link to={`/activitiesDashboard`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="chart-line" style={{ color: '#333333' }} />
                            <MDBCardText>Activities Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/bookingsDashboard`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="quran" style={{ color: '#333333' }} />
                            <MDBCardText>Bookings Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displaySuggestionForm`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="lightbulb" style={{ color: '#333333' }} />
                            <MDBCardText>Suggestions Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displayFeedbackForm`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="comment" style={{ color: '#333333' }} />
                            <MDBCardText>Feedbacks Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displayRatingsAndReviews`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="star" style={{ color: '#333333' }} />
                            <MDBCardText>Ratings Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>
                        
                        <Link to={`/users`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="user-injured" style={{ color: '#333333' }} />
                            <MDBCardText>Users</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/auditlog`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="paperclip" style={{ color: '#333333' }} />
                            <MDBCardText>Audit Log</MDBCardText>
                          </MDBListGroupItem>
                        </Link>
                        <Link to={`/coupons`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                          <MDBIcon fas icon="ticket-alt" style={{ color: '#333333' }}/>
                            <MDBCardText>Coupons</MDBCardText>
                          </MDBListGroupItem>
                        </Link>
                        </>
                      )}
  
                      {user && user.role === "user" && (
                        <>
                        <Link to={`/profile`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="chart-line" style={{ color: '#333333' }}/>
                        <MDBCardText>Profile</MDBCardText>
                    </MDBListGroupItem>
                    </Link>
                    
                    <Link to={`/creditcard`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="credit-card"style={{ color: '#333333' }} />
                        <MDBCardText>Credit Cards</MDBCardText>
                    </MDBListGroupItem>
                    </Link>

                        <Link to={`/userbookings`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="history" style={{ color: '#333333' }} />
                            <MDBCardText>Bookings</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displaySuggestionForm`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="lightbulb" style={{ color: '#333333' }} />
                            <MDBCardText>Suggestions</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displayFeedbackForm`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="comment" style={{ color: '#333333' }} />
                            <MDBCardText>Feedbacks</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displayRatingsAndReviews`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="star" style={{ color: '#333333' }} />
                            <MDBCardText>Ratings</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/Forum`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fab icon="rocketchat" style={{ color: '#333333' }} />

                            <MDBCardText>Forum</MDBCardText>
                          </MDBListGroupItem>
                        </Link>
                        </>
                      )}
                    </MDBListGroup>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol lg="8">
  <Paper sx={{ width: '100%', mb: 2 }}>
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" id="tableTitle" component="div">
          Users Dashboard
        </Typography>
        <Tooltip title="Populate Admins">
            <IconButton  onClick={populateAdminAccounts}>
            <AddIcon />
            </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          id="search"
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          placeholder="Search"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
        </IconButton>
      </Box>
    </Toolbar>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Time after deactivation</TableCell>
            <TableCell>Action</TableCell> 
            
            {/* Added for delete button */}
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
  {user.deactivefully && formatDistance(new Date(), new Date(user.deactivefully))}
</TableCell>
              <TableCell>
                <IconButton color="error" onClick={() => handleOpen(user)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
</MDBCol>

            </MDBRow>
          ) : (
            <Typography variant="body1">Loading user profile...</Typography>
          )}
          
        </MDBContainer>
        <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete User
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button variant="contained" color="error" onClick={deleteActivity}>
                        Delete
                    </Button>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
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
      </section>
      
    );
}

export default Users;
