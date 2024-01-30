import './App.css';
import { Container, AppBar, Toolbar, Typography, Grid, BottomNavigation, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Logo from './assets/logo.png';
import SuggestionForm from './pages/SuggestionForm';
import DisplaySuggestionForm from './pages/DisplaySuggestionForm';
import EditSuggestionForm from './pages/EditSuggestionForm';
import FeedbackForm from './pages/FeedbackForm';
import DisplayFeedbackForm from './pages/DisplayFeedbackForm';
import EditFeedbackForm from './pages/EditFeedbackForm'
import RatingsAndReviews from './pages/RatingsAndReviews';
import DisplayRatingsAndReviews from './pages/DisplayRatingsAndReviews';
import EditRatingsAndReviews from './pages/EditRatingsAndReviews';
import FormSuccess from './pages/FormSuccess';
import AboutUs from './pages/AboutUs';
import FAQs from './pages/FAQs';

import Activities from './pages/Activities';
import ActivityInfo from './pages/ActivityInfo';

function App() {
  return (
    <Router>
      <ThemeProvider theme={MyTheme}>
        <AppBar position="static" className='AppBar'>
          <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <img src={Logo} alt="logo" width={100} />
              </Link>
              <Link to="/activities"><Typography>Activities</Typography></Link>
              <Link to="/suggestionForm" ><Typography>Suggestion Form</Typography></Link>
              <Link to="/displaySuggestionForm" ><Typography>DisplaySuggestionForm</Typography></Link>
              <Link to="/feedbackForm" ><Typography>Feedback Form</Typography></Link>
              <Link to="/displayFeedbackForm" ><Typography>DisplayFeedbackForm</Typography></Link>
              <Link to="/ratingsAndReviews" ><Typography>Ratings and Reviews</Typography></Link>
              <Link to="/displayRatingsAndReviews" ><Typography>DisplayRatingsReviews</Typography></Link>
              <Link to="/aboutUs" ><Typography>About Us</Typography></Link>
              <Link to="/faqs" ><Typography>FAQs</Typography></Link>
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path={"/"} />
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
            <Route path={"/activityInfo"} element={<ActivityInfo />} />
          </Routes>
        </Container>

        {/* <script type="text/javascript">!function(t,e){t.artibotApi = { l: [], t: [], on: function () { this.l.push(arguments) }, trigger: function () { this.t.push(arguments) } };var a=!1,i=e.createElement("script");i.async=!0,i.type="text/javascript",i.src="https://app.artibot.ai/loader.js",e.getElementsByTagName("head").item(0).appendChild(i),i.onreadystatechange=i.onload=function(){if(!(a||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState)){new window.ArtiBot({ i: "db63d958-7c0b-441b-bbed-372e7d73c014" });a=!0}}}(window,document);</script> */}

        <BottomNavigation
          className="BottomNavigation"
          showLabels
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
  );
}

export default App;