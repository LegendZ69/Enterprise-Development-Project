import React, { useEffect, useState, useContext } from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
    MDBProgress,
    MDBProgressBar,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem
  } from 'mdb-react-ui-kit';
  
import { Box, Typography, Card, CardContent,IconButton, Avatar,Button } from '@mui/material';
import { AccountCircle, AccessTime, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import http from '../http';
import { Link } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function UserProfile() {
    const [userProfile, setUserProfile] = useState(null);
    const { user } = useContext(UserContext);

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

    return (
        // <Box>
        //     <Typography variant="h5" sx={{ my: 2 }}>
        //         User Profile
        //     </Typography>
        //     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>

        //         <Box sx={{ flexGrow: 1 }} />
        //         {
        //             user && (
        //                 <Link to="/changepassword" style={{ textDecoration: 'none' }}>
        //                     <Button variant='contained'>
        //                         Change Password
        //                     </Button>
        //                 </Link>
        //             )
        //         }
        //     </Box>

        //     {userProfile ? (
        //         <Card>
        //             <CardContent>
        //                 <Box sx={{ display: 'flex', mb: 1 }}>
                        // <Avatar
                        //         alt="Profile Picture"
                        //         src={`${import.meta.env.VITE_FILE_BASE_URL}${userProfile.imageFile}`}
                        //         sx={{ width: 60, height: 60, marginRight: 2, borderRadius: '50%' }}
                        //     />
        //                     <Typography variant="h6" sx={{ flexGrow: 1 }}>
        //                         Name: {userProfile.name}
        //                     </Typography>
        //                     <Link to={`/editprofile/${user.id}`}>
        //                                                 <IconButton color="primary" sx={{ padding: '4px' }}>
        //                                                     <Edit />
        //                                                 </IconButton>
        //                                             </Link>
        //                 </Box>
        //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
        //                     <Typography>Email: {userProfile.email}</Typography>
        //                 </Box>
        //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
        //                     <Typography>Role: {userProfile.role}</Typography>
        //                 </Box>
        //                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
        //                         <Typography>Phone Number: {userProfile.phoneNumber}</Typography>
        //                     </Box>
        //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
        //                     <Typography>
        //                         User Status: {userProfile.status}
        //                     </Typography>
        //                 </Box>
        //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
        //                     <Typography>
        //                     Two-Factor Authentication (Email): {userProfile.twoFactorEnabled ? "Enabled" : "Disabled"}
        //                     </Typography>
        //                 </Box>
        //                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
        //                     <Typography>
        //                         User since {dayjs(userProfile.createdAt).format('YYYY-MM-DD')}
        //                     </Typography>
        //                 </Box>

        //                 {/* Add more user-related information as needed */}
        //             </CardContent>
        //         </Card>
        //     ) : (
        //         <Typography variant="body1">Loading user profile...</Typography>
        //     )}
        // </Box>
        <section>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>
                <a href='/'>Home</a>
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
                  src={`${import.meta.env.VITE_FILE_BASE_URL}${userProfile.imageFile}`}
                  sx={{ width: 300, height: 300, borderRadius: '50%' }}
                />
              </div>
              <p className="text-muted mb-1">Name: {userProfile.name}</p>
              <p className="text-muted mb-1">Role: {userProfile.role}</p>
              <p className="text-muted mb-1">User Status: {userProfile.status}</p>
              <p className="text-muted mb-1">User since {dayjs(userProfile.createdAt).format('YYYY-MM-DD')}</p>
              
              <div className="d-flex justify-content-center mb-2">
                <Link to={`/editprofile/${user.id}`} style={{ marginRight: '10px' }}>
                    <MDBBtn>Edit Profile</MDBBtn>
                </Link>
                <Link to="/changepassword" style={{ marginRight: '10px', textDecoration: 'none' }}>
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
                <Link to={`/activitiesDashboard`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="chart-line" style={{ color: '#333333' }}/>
                        <MDBCardText>Activities Dashboard</MDBCardText>
                    </MDBListGroupItem>
                    </Link>

                    <Link to={`/bookingsDashboard`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="quran"style={{ color: '#333333' }} />
                        <MDBCardText>Bookings Dashboard</MDBCardText>
                    </MDBListGroupItem>
                    </Link>

                    <Link to={`/users`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="user-injured" style={{ color: '#333333' }}/>
                        <MDBCardText>Users</MDBCardText>
                    </MDBListGroupItem>
                    </Link>

                    <Link to={`/auditlog`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="paperclip" style={{ color: '#333333' }}/>
                        <MDBCardText>Audit Log</MDBCardText>
                    </MDBListGroupItem>
                    </Link>



                    </>
                    )}

                {user && user.role === "user" && (
                    <>
                    <Link to={`/creditcard`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="credit-card"style={{ color: '#333333' }} />
                        <MDBCardText>Credit Cards</MDBCardText>
                    </MDBListGroupItem>
                    </Link>


                    <Link to={`/userbookings`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fas icon="history" style={{ color: '#333333' }}/>
                        <MDBCardText>Bookings</MDBCardText>
                    </MDBListGroupItem>
                    </Link>

                    <Link to={`/displayfeedbackform`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fas icon="comment"style={{ color: '#333333' }} />
                    
                        <MDBCardText>Feedbacks</MDBCardText>
                    </MDBListGroupItem>
                    </Link>

                    <Link to={`/displayRatingsAndReviews`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fas icon="star" style={{ color: '#333333' }}/>
                        <MDBCardText>Ratings</MDBCardText>
                    </MDBListGroupItem>
                    </Link>


                    <Link to={`/Forum`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <MDBIcon fab icon="rocketchat" style={{ color: '#333333' }}/>

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
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userProfile.name}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userProfile.email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Phone</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userProfile.phoneNumber}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Two-Factor Authentication (Email):</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted"> {userProfile.twoFactorEnabled ? "Enabled" : "Disabled"}</MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

           
          </MDBCol>
        </MDBRow>
        ) : (
                <Typography variant="body1">Loading user profile...</Typography>
            )}
      </MDBContainer>
    </section>
    );
}

export default UserProfile;
