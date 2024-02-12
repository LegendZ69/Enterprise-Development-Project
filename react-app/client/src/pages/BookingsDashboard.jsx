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
  Avatar
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
  import UserContext from "../contexts/UserContext";
  import dayjs from "dayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import http from '../http';

function BookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    http.get(`/booking/adminBookings`)
      .then((res) => {
        setBookings(res.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error.message);
      });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = bookings.map((booking) => booking.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDeleteBooking = (id) => {
    http.delete(`/booking/${id}`)
      .then(() => {
        fetchBookings();
        setDeleteDialogOpen(false); 
      })
      .catch((error) => {
        console.error('Error deleting booking:', error.message);
      });
  };
  

  const filteredBookings = bookings.filter((booking) =>
    booking.id.toString().includes(searchTerm.toLowerCase()) ||
    booking.activityId.toString().includes(searchTerm.toLowerCase()) ||
    booking.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userId.toString().includes(searchTerm.toLowerCase()) ||
    booking.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
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
              Bookings Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="search"
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Tooltip title="Filter list">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredBookings.length}
                    checked={filteredBookings.length > 0 && selected.length === filteredBookings.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all bookings' }}
                  />
                </TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Activity ID</TableCell>
                <TableCell>Activity Name</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => {
                const isItemSelected = isSelected(booking.id);
                const labelId = `enhanced-table-checkbox-${booking.id}`;

                return (
                    <TableRow
                    hover
                    onClick={(event) => handleClick(event, booking.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={booking.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.activityId}</TableCell>
                    <TableCell>{booking.activityTitle}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{booking.user.name}</TableCell>
                    <TableCell>
                    <IconButton onClick={(event) => {
    event.stopPropagation(); // Prevent event propagation
    setDeleteBookingId(booking.id);
    setDeleteDialogOpen(true);
}} color="error">
    <DeleteIcon />
</IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
            </MDBCol>
          </MDBRow>
        ) : (
          <Typography variant="body1">Loading user profile...</Typography>
        )}
        
      </MDBContainer>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this activity?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleDeleteBooking(deleteBookingId)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </section>
    
  );
}

export default BookingsDashboard;
