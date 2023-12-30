import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Logo from './assets/logo.png';
import AddSuggestionForm from './pages/AddSuggestionForm';
import SuggestionForm from './pages/SuggestionForm';
import EditSuggestionForm from './pages/EditSuggestionForm';
import FeedbackForm from './pages/FeedbackForm';
import RatingsAndReviews from './pages/RatingsAndReviews';
import FormSuccess from './pages/FormSuccess';
import Activities from './pages/Activities';

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
              <Link to="/feedbackForm" ><Typography>Feedback Form</Typography></Link>
              <Link to="/ratingsAndReviews" ><Typography>Ratings and Reviews</Typography></Link>
            </Toolbar>
          </Container>
        </AppBar>

        <Container>
          <Routes>
            <Route path={"/"} />
            <Route path={"/addSuggestionForm"} element={<AddSuggestionForm />} />
            <Route path={"/suggestionForm"} element={<SuggestionForm />} />
            <Route path={"/editSuggestionForm/:id"} element={<EditSuggestionForm />} />
            <Route path={"/feedbackForm"} element={<FeedbackForm />} />
            <Route path={"/ratingsAndReviews"} element={<RatingsAndReviews />} />
            <Route path={"/formSuccess"} element={<FormSuccess />} />
            <Route path={"/activities"} element={<Activities />} />

          </Routes>
        </Container>
      </ThemeProvider>
    </Router>
  );
}

export default App;