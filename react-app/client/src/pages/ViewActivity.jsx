import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Button, TextField, Card, CardContent, MenuItem, Grid, Divider, IconButton, Rating, Input } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import SportsIcon from '@mui/icons-material/Sports';
import FamilyIcon from '@mui/icons-material/FamilyRestroom';
import LeisureIcon from '@mui/icons-material/BeachAccess';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import 'dayjs/locale/en-sg';
import http from '../http';
import global from '../global';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function ViewActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [bookingDate, setBookingDate] = useState(dayjs()); // Initialize with current date
  const [quantity, setQuantity] = useState(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [timeSlotsList, setTimeSlotsList] = useState([]);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  const [ratingsAndReviewsList, setRatingsAndReviewsList] = useState([]);
  const [search, setSearch] = useState('');

  const getRatingsAndReviews = () => {
    http.get('/ratingsAndReviews').then((res) => {
      setRatingsAndReviewsList(res.data);
    });
  };

  useEffect(() => {
    http.get(`/activity/${id}`)
      .then((res) => {
        setActivity(res.data);
        console.log('Fetched activity:', res.data); // Add this line to inspect the fetched activity
        if (res.data.timeslots && res.data.timeslots.length > 0) {
          const slots = res.data.timeslots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
          }));
          setTimeSlotsList(slots);
        }
      })
      .catch((error) => {
        console.error('Error fetching activity:', error.message);
      });

    getRatingsAndReviews();

  }, [id]);

  window.initMap = () => {

    console.log('Function');
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: parseFloat(activity.latitude), lng: parseFloat(activity.longitude) },
      zoom: 15,
    });

    new window.google.maps.Marker({
      position: { lat: parseFloat(activity.latitude), lng: parseFloat(activity.longitude) },
      map,
      title: activity.title,
    });

  };



  // new code
  useEffect(() => {
    if (activity && !googleScriptLoaded) {
      // Load Google Maps API script
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBKhaM1vsmsMJEd0-8F9u4-typ3ABA3eKw&libraries=places&callback=initMap`; // Replace YOUR_API_KEY with your actual API key
      googleMapsScript.onload = () => {
        console.log('Google Maps API script loaded successfully');
        setGoogleScriptLoaded(true);
      };
      googleMapsScript.onerror = () => {
        console.error('Error loading Google Maps API script');
      };
      window.document.body.appendChild(googleMapsScript);
    }
  }, [activity, googleScriptLoaded]);



  useEffect(() => {
    if (googleScriptLoaded && activity) {
      // Call the initMap function once the Google Maps API script has been loaded
      console.log('Called');

      window.initMap();
    }
  }, [googleScriptLoaded, activity]);

  const handleBookingDateChange = (date) => {
    setBookingDate(date);
  };


  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
  };

  const handleTimeSlotChange = (event) => {
    setSelectedTimeSlot(event.target.value);
  };

  const handleAddToCartClick = () => {
    console.log(activity.price)
    const requestData = {
      bookingDate: bookingDate.toISOString().split('T')[0],
      quantity: quantity,
      selectedTimeSlot: selectedTimeSlot, // Change here
    };

    http.post(`/booking/${id}`, requestData)
      .then((res) => {
        const newBookingId = res.data.id;
        console.log('Booking successful:', res.data);
        toast.success('Activity added to cart');

      })
      .catch((error) => {
        console.error('Booking failed:', error.message);
        toast.error(`Failed to add activity to cart: ${error.response?.data?.message || 'Unknown error'}`);
      });
  };

  if (!activity) {
    return <div>Loading...</div>;
  }






  const { user } = useContext(UserContext);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };



  const searchRatingsAndReviews = () => {
    http.get(`/ratingsAndReviews?search=${search}`).then((res) => {
      setRatingsAndReviewsList(res.data);
    });
  };

  // useEffect(() => {
  //   getRatingsAndReviews();
  // }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchRatingsAndReviews();
    }
  };

  const onClickSearch = () => {
    searchRatingsAndReviews();
  };

  const onClickClear = () => {
    setSearch('');
    getRatingsAndReviews();
  };

  return (
    <Box sx={{ mt: 10 }}>
      {/* Category Text and Icon */}
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {/* Category Icon */}
        {activity.category === 'sports' && <SportsIcon sx={{ mr: 1, fontSize: 30, fontWeight: 'bold' }} />}
        {activity.category === 'family' && <FamilyIcon sx={{ mr: 1, fontSize: 30, fontWeight: 'bold' }} />}
        {activity.category === 'leisure' && <LeisureIcon sx={{ mr: 1, fontSize: 30, fontWeight: 'bold' }} />}

        {/* Category Text */}
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
        </Typography>
      </Typography>

      {/* Activity Title */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        {activity.title}
      </Typography>

      {/* Activity Image */}
      {activity.imageFile && (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <img
            alt="activity"
            src={`${import.meta.env.VITE_FILE_BASE_URL}${activity.imageFile}`}
            style={{ width: '65%', height: '100%', borderRadius: '8px' }}
          />
        </Box>
      )}

      {/* Activity Date, Location, and Description */}
      <Card>
        <CardContent>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {/* Date Icon */}
            <EventIcon sx={{ mr: 1, fontSize: 24, color: 'primary.main' }} />
            {/* Date */}
            <Typography variant="body2" style={{ fontSize: '24px' }}>
              {new Date(activity.eventDate).toLocaleDateString('en-GB')}
            </Typography>
          </Typography>

          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {/* Location Icon */}
            <LocationOnIcon sx={{ mr: 1, fontSize: 24, color: 'secondary.main' }} />
            {/* Location */}
            <Typography variant="body2" style={{ fontSize: '24px' }}>
              {activity.location}
            </Typography>
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap', fontSize: '18px' }}>
            {activity.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Location Map */}
      <Box sx={{ mt: 2 }}>
        <div id="map" style={{ width: '100%', height: '400px', borderRadius: '8px' }}></div>
      </Box>

      {/* Price and Booking Section */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Card sx={{ width: '300px', marginRight: '16px' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Price */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Price: ${activity.price}
            </Typography>

            {/* Quantity */}
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              sx={{ mb: 2 }}
            />

            {/* Booking Date Picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-sg'>
              <DatePicker
                sx={{ width: '100%' }}
                margin="dense"
                label="Select Booking Date"
                name="bookingDate"
                value={bookingDate}
                onChange={handleBookingDateChange}
                onBlur={handleBookingDateChange}
                renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
              />
            </LocalizationProvider>

            {/* Time Slot Dropdown */}
            <TextField
              select
              label="Select Time Slot"
              value={selectedTimeSlot || ''}
              onChange={handleTimeSlotChange}
              sx={{ width: '100%', mb: 2 }}
            >
              {timeSlotsList.map((slot, index) => (
                <MenuItem key={index} value={slot.startTime + '-' + slot.endTime}>
                  {dayjs(slot.startTime).format('HH:mm')} - {dayjs(slot.endTime).format('HH:mm')}
                </MenuItem>
              ))}
            </TextField>


            {/* Buttons Container */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCartClick}
                sx={{ flex: 1, marginRight: '8px' }}
              >
                Add to Cart
              </Button>

              {/* Go to Cart Button */}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  navigate('/cart');
                }}
                sx={{ flex: 1 }}
              >
                Go to Cart
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h2" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
        Reviews
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
        <Link to="/ratingsAndReviews" style={{ textDecoration: 'none' }}>
          <Button variant='contained'>
            Add
          </Button>
        </Link>
      </Box>

      {
        ratingsAndReviewsList.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            No reviews yet.
          </Typography>
        ) :
          (
            ratingsAndReviewsList.map((ratingsAndReviews, i) => (
              <Grid item xs={12} md={6} lg={4} key={ratingsAndReviews.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex' }}>
                      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                        {ratingsAndReviews.firstName} {ratingsAndReviews.lastName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                      <AccountCircle />
                      <Typography sx={{ mr: 1 }}>
                        {ratingsAndReviews.user?.name}
                      </Typography>
                      <AccessTime fontSize='small' />
                      <Typography variant='body2'>
                        {dayjs(ratingsAndReviews.createdAt).format(global.datetimeFormat)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 1 }} color="text.secondary">
                      <Rating value={ratingsAndReviews.rating} readOnly />
                    </Box>
                    <Typography gutterBottom sx={{ whiteSpace: 'pre-wrap' }}>
                      {ratingsAndReviews.review}
                    </Typography>
                    {
                      ratingsAndReviews.imageFile && (
                        <Box className="aspect-ratio-container">
                          <img alt="Reviews Photo" src={`${import.meta.env.VITE_FILE_BASE_URL}${ratingsAndReviews.imageFile}`}></img>
                        </Box>
                      )
                    }
                  </CardContent>
                </Card>
              </Grid>
            ))
          )
      }
      <ToastContainer />
    </Box>
  );
}

export default ViewActivity;