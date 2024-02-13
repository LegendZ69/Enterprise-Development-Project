import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Avatar,
} from "@mui/material";
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
import http from "../http";

function UserBookings() {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useContext(UserContext);
  const bookingsPerPage = 3;

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
    http
      .get("/booking/userBookings")
      .then((res) => {
        console.log("API Response:", res.data);
        setUserBookings(res.data);
      })
      .catch((error) => {
        console.error("Error fetching user bookings:", error.message);
        setError("Error fetching user bookings. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Calculate the index of the last booking to display
  const indexOfLastBooking = currentPage * bookingsPerPage;
  // Calculate the index of the first booking to display
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  // Slice the userBookings array to get the bookings for the current page
  const currentBookings = userBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                        <Link
                          to={`/profile`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon
                              fas
                              icon="chart-line"
                              style={{ color: "#333333" }}
                            />
                            <MDBCardText>Profile</MDBCardText>
                          </MDBListGroupItem>
                        </Link>
                        <Link
                          to={`/activitiesDashboard`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon
                              fas
                              icon="chart-line"
                              style={{ color: "#333333" }}
                            />
                            <MDBCardText>Activities Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link
                          to={`/bookingsDashboard`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon
                              fas
                              icon="quran"
                              style={{ color: "#333333" }}
                            />
                            <MDBCardText>Bookings Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link
                          to={`/users`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon
                              fas
                              icon="user-injured"
                              style={{ color: "#333333" }}
                            />
                            <MDBCardText>Users</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link
                          to={`/auditlog`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon
                              fas
                              icon="paperclip"
                              style={{ color: "#333333" }}
                            />
                            <MDBCardText>Audit Log</MDBCardText>
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

                        <Link to={`/viewpayments`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="history" style={{ color: '#333333' }} />
                            <MDBCardText>View Payments</MDBCardText>
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
              {currentBookings.length === 0 ? (
                <MDBCard>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="src/assets/bookings.png"
                      alt="No bookings"
                      style={{ width: "150px", opacity: "0.8" }} // Adjust width and opacity as desired
                    />
                    <Typography variant="h5" sx={{ mt: 2 }}>
                      No bookings yet
                    </Typography>
                  </Box>
                </MDBCard>
              ) : (
                currentBookings.map((booking) => (
                  <Box
                    key={booking.id}
                    sx={{
                      mb: 4,
                      border: "1px solid #ccc",
                      padding: "16px",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Activity: {booking.activityTitle}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Date Booked:{" "}
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </Typography>
                      {booking.price && (
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          Total Price: ${booking.price}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Link
                        to={`/viewBooking/${booking.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button variant="contained" color="primary">
                          View Details
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                ))
              )}
              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                {[
                  ...Array(
                    Math.ceil(userBookings.length / bookingsPerPage)
                  ).keys(),
                ].map((number) => (
                  <Button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    variant="outlined"
                    sx={{ mx: 1 }}
                  >
                    {number + 1}
                  </Button>
                ))}
              </Box>
            </MDBCol>
          </MDBRow>
        ) : (
          <Typography variant="body1">Loading user profile...</Typography>
        )}
      </MDBContainer>
    </section>
  );
}

export default UserBookings;
