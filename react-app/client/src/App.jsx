import './App.css';
import { useState, useEffect, useContext } from 'react';
import { Container, AppBar, Toolbar, Typography, Grid, BottomNavigation, Box, Button,MenuItem, Menu, Link as MuiLink,Avatar } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Logo from './assets/logo.png';
import Home from './pages/Home';

import SuggestionForm from './pages/SuggestionForm';
import DisplaySuggestionForm from './pages/DisplaySuggestionForm';
import EditSuggestionForm from './pages/EditSuggestionForm';

import FeedbackForm from './pages/FeedbackForm';
import DisplayFeedbackForm from './pages/DisplayFeedbackForm';
import EditFeedbackForm from './pages/EditFeedbackForm';

import RatingsAndReviews from './pages/RatingsAndReviews';
import DisplayRatingsAndReviews from './pages/DisplayRatingsAndReviews';
import EditRatingsAndReviews from './pages/EditRatingsAndReviews';

import FormSuccess from './pages/FormSuccess';
import AboutUs from './pages/AboutUs';
import FAQs from './pages/FAQs';

import Activities from './pages/Activities';
import AddActivity from './pages/AddActivity';
import EditActivity from './pages/EditActivity'
import ViewActivity from './pages/ViewActivity'
import UserBookings from './pages/UserBookings';
import ViewBooking from './pages/ViewBooking';
import ActivitiesDashboard from './pages/ActivitiesDashboard';
import BookingsDashboard from './pages/BookingsDashboard';

import Coupons from './pages/Coupons';
import AddCoupons from './pages/AddCoupons';
import UpdateCoupons from './pages/UpdateCoupons';
import CouponsValid from './pages/CouponValid';
import CreditCard from './pages/CreditCard';
import AddCreditCard from './pages/AddCreditCard';
import UpdateCreditCard from './pages/UpdateCreditCard';
import Checkout from './pages/Checkout';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';
import Users from './pages/Users';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import { Book } from '@mui/icons-material';
import AuditLog from './pages/AuditLog';
import ResetPassword from './pages/ResetPassword';
import ForgetPassword from './pages/ForgetPassword';
import ReactivateAccount from './pages/ReactivateAccount';
import Verify from './pages/Verify';

import ThreadList from './pages/Forum';
import CreateThread from './pages/CreateThread'
import ThreadDetail  from './pages/Thread';
function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
    getUserProfile();
  }, [user]);
  const getUserProfile = () => {
    if (user) {
        http.get(`/user/${user.id}`).then((res) => {
            setUserProfile(res.data);
        });
    }
};

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <UserContext.Provider value={{ user, setUser }}>
    <Router>
      <ThemeProvider theme={MyTheme}>
        <AppBar position="static" className='AppBar'>
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/activities">
                <img src={Logo} alt="logo" width={100} />
              </Link>
              <Link to="/activities"><Typography>Activities</Typography></Link>
              <Link to="/feedbackForm" ><Typography>Contact Us</Typography></Link>
              <Link to="/aboutUs" ><Typography>About Us</Typography></Link>
              <Link to="/faqs" ><Typography>FAQs</Typography></Link>
              <Link to="/coupons" ><Typography>Coupons</Typography></Link>
              <Link to="/creditcard" ><Typography>Credit card</Typography></Link>
              <Link to="/checkout" ><Typography>Checkout</Typography></Link>      
              <Link to ="/Forum"><Typography>Forums</Typography></Link>
              {user && user.role === "admin" && (
              <>
                <Button
                  onClick={handleMenuOpen}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    textTransform: 'none', // Prevent uppercase transformation
                    textDecoration: 'none', // Remove underline
                    color: 'inherit', // Inherit color
                    padding: 0, // Remove default padding
                    margin: '0 8px', // Add some margin for spacing
                    background: 'none', // Remove background
                    border: 'none', // Remove border
                    cursor: 'pointer', // Change cursor to indicate it's clickable
                  }}
                >Admin Privileges</Button>
                <Menu
                  id="admin-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem component={Link} to="/activitiesDashboard" onClick={handleMenuClose}>AdminActivity</MenuItem>
                  <MenuItem component={Link} to="/bookingsDashboard" onClick={handleMenuClose}>AdminBookings</MenuItem>
                  <MenuItem component={Link} to="/users" onClick={handleMenuClose}>Users</MenuItem>
                      <MenuItem component={Link} to="/auditlog" onClick={handleMenuClose}>Audit Log</MenuItem>
                      <MenuItem component={Link} to="/displayFeedbackForm" onClick={handleMenuClose}>Feedback Forms</MenuItem>
                      <MenuItem component={Link} to="/displaySuggestionForm" onClick={handleMenuClose}>Suggestion Forms</MenuItem>
                      <MenuItem component={Link} to="/displayRatingsAndReviews" onClick={handleMenuClose}>Ratings and Reviews</MenuItem>

                </Menu>
              </>
              )}
              <Box sx={{ flexGrow: 1 }}></Box>
              {user && userProfile && (
                <>
                  <Link to="/profile"><Avatar
                  alt="Profile Picture"
                  src={`${import.meta.env.VITE_FILE_BASE_URL}${userProfile.imageFile}`}
                  sx={{ width: 50, height: 50, borderRadius: '50%' }}
                /></Link>
                  <Button onClick={logout}><Typography>Logout</Typography></Button>
                </>
              )
              }
              {!user && (
                <>
                  <Link to="/register" ><Typography>Register</Typography></Link>
                  <Link to="/login" ><Typography>Login</Typography></Link>
                </>
              )}
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
              <Route path={"/"} element={<Home />} />
              
            <Route path={"/suggestionForm"} element={<SuggestionForm />} />
            <Route path={"/displaySuggestionForm"} element={<DisplaySuggestionForm />} />
              <Route path={"/editSuggestionForm/:id"} element={<EditSuggestionForm />} />

              <Route path={"/feedbackForm"} element={<FeedbackForm />} />              
            <Route path={"/displayFeedbackForm"} element={<DisplayFeedbackForm />} />
              <Route path={"/editFeedbackForm/:id"} element={<EditFeedbackForm />} />

            <Route path={"/ratingsAndReviews"} element={<RatingsAndReviews />} />
            <Route path={"/displayRatingsAndReviews"} element={<DisplayRatingsAndReviews />} />
              <Route path={"/editRatingsAndReviews/:id"} element={<EditRatingsAndReviews />} />

            <Route path={"/formSuccess"} element={<FormSuccess />} />
            <Route path={"/aboutUs"} element={<AboutUs />} />
            <Route path={"/faqs"} element={<FAQs />} />

            <Route path={"/activities"} element={<Activities />} />
            <Route path={"/addActivity"} element={<AddActivity />} />
            <Route path={"/viewActivity/:id"} element={<ViewActivity />} />
            <Route path={"/editActivity/:id"} element={<EditActivity />} />
            <Route path={"/userBookings"} element={<UserBookings />} />
            <Route path={"/viewBooking/:id"} element={<ViewBooking />} />
            <Route path={"/activitiesDashboard"} element={<ActivitiesDashboard />} />
            <Route path={"/bookingsDashboard"} element={<BookingsDashboard />} />

            <Route path={"/coupons"} element={<Coupons />} />
            <Route path={"/addCoupons"} element={<AddCoupons />} />
            <Route path={"/updateCoupons/:id"} element={<UpdateCoupons />} />
            <Route path={"/validCoupon/:id"} element={<CouponsValid />} />
            <Route path={"/creditcard"} element={<CreditCard />} />
            <Route path={"/addCreditCard"} element={<AddCreditCard />} />
            <Route path={"/updateCreditCard/:id"} element={<UpdateCreditCard />} />
            <Route path={"/checkout"} element={<Checkout />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/form"} element={<MyForm />} />
            <Route path={"/users"} element={<Users />} />
            <Route path={"/profile"} element={<Profile />} />
            <Route path={"/editprofile/:id"} element={< EditProfile />} />
            <Route path={"/changepassword"} element={<ChangePassword />} />
            <Route path={"/auditlog"} element ={<AuditLog/>}/>
            <Route path={"/resetpassword"} element ={<ResetPassword/>}/>
            <Route path={"/forgetpassword"} element ={<ForgetPassword/>}/>
            <Route path={"/reactivateaccount"} element ={<ReactivateAccount/>}/>
            <Route path={"/verify"} element ={<Verify/>}/>

            <Route path={"/Forum"} element ={<ThreadList/>}/>
            <Route path={"/CreateThread"} element ={<CreateThread/>}/>
            <Route path={"/Thread/:threadId"} element={<ThreadDetail />} />
          </Routes>
        </Container>

        <BottomNavigation
          className="BottomNavigation"
          showlabels
          sx={{ mt: 30, backgroundColor: "black", color: "white" }}
        >
          <Grid container alignItems="center">
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography paddingLeft={5}>
                UPlay. All rights reserved. <span>&copy;</span> 2024
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingRight: 5,
              }}
            >
              <Link to="/" style={{ textDecoration: 'none' }}>Home</Link>
              <Link to="/aboutUs" style={{ textDecoration: 'none' }}>About Us</Link>
              <Link to="/contactUs" style={{ textDecoration: 'none' }}>Contact Us</Link>
              <Link to="/faqs" style={{ textDecoration: 'none' }}>FAQs</Link>
              <Link to="/activities" style={{ textDecoration: 'none' }}>Activities</Link>
              <Link to="/reviews" style={{ textDecoration: 'none' }}>Reviews</Link>
            </Grid>
          </Grid>
        </BottomNavigation>

      </ThemeProvider>
    </Router>
    </UserContext.Provider>
  );
}

export default App;