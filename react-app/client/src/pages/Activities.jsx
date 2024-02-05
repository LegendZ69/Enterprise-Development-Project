import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Button,
  Container,
  CssBaseline,
  Stack,
  CardMedia,
  CardActions,
  InputBase
} from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Activities() {
  const [activitiesList, setActivitiesList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // Define selectedCategory here
  const { user } = useContext(UserContext);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const getActivities = () => {
    let url = '/activity';
    if (search) {
        url += `?search=${search}`;
    }

    if (selectedCategory !== 'all') {
        url = `/activity/category/${selectedCategory}?search=${search}`;
    }

    http.get(url).then((res) => {
        setActivitiesList(res.data);
    });
};

  useEffect(() => {
    getActivities();
  }, [search, selectedCategory]);

  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      getActivities();
    }
  };

  const onClickSearch = () => {
    getActivities();
  };

  const onClickClear = () => {
    setSearch('');
    getActivities();
  };

  

 return (
    <>
      {/* Search Bar and other stuff */}
<Box sx={{ pt: 4, pb: 2, textAlign: 'center', position: 'relative' }}>
  <div className="wrapper">
    <div className="searchBar">
      <InputBase
        id="searchQueryInput"
        type="text"
        name="searchQueryInput"
        placeholder="Search"
        value={search}
        onChange={onSearchChange}
        onKeyDown={onSearchKeyDown}
        sx={{
          width: '60%',
          height: '4rem',
          background: '#f5f5f5',
          borderRadius: '2rem',
          padding: '0 3.5rem 0 1.5rem',
          fontSize: '1rem',
          borderBottom: 'none', // Remove underline
        }}
      />
      {search && ( // Render clear icon only if there is text
        <>
          <IconButton color="primary" onClick={onClickClear} sx={{ position: 'absolute',marginLeft: '-7rem' }}>
            <Clear />
          </IconButton>
        </>
      )}
      <IconButton color="primary" onClick={onClickSearch} sx={{ marginLeft: '-3.5rem' }}>
        <Search />
      </IconButton>
    </div>
  </div>
</Box>


<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/suggestionForm" style={{ textDecoration: 'none' }}>
                    <Button variant="contained">
                        Suggest An Activity
                    </Button>
                </Link>
            </Box>
      

      {/* Category Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant={selectedCategory === 'all' ? 'contained' : 'outlined'} onClick={() => handleCategoryChange('all')}>
          All
        </Button>
        <Button variant={selectedCategory === 'family' ? 'contained' : 'outlined'} onClick={() => handleCategoryChange('family')}>
          Family
        </Button>
        <Button variant={selectedCategory === 'leisure' ? 'contained' : 'outlined'} onClick={() => handleCategoryChange('leisure')}>
          Leisure
        </Button>
        <Button variant={selectedCategory === 'sports' ? 'contained' : 'outlined'} onClick={() => handleCategoryChange('sports')}>
          Sports
        </Button>
      </Stack>

      <Container sx={{ py: 8, maxWidth: 'md' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
         
          {user && (
            <Link to="/addActivity" style={{ textDecoration: 'none' }}>
              <Button variant="contained">Add</Button>
            </Link>
          )}
        </Box>

        <Grid container spacing={4}>
          {activitiesList.map((activity) => (
            <Grid item key={activity.id} xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {activity.imageFile && (
                  <CardMedia
                    component="div"
                    sx={{
                      pt: '55%',
                    }}
                    image={`${import.meta.env.VITE_FILE_BASE_URL}${activity.imageFile}`}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {activity.title}
                    </Typography>
                    {user && user.id === activity.userId && (
                      <Link to={`/editActivity/${activity.id}`}>
                        <IconButton color="primary" sx={{ padding: '4px' }}>
                          <Edit />
                        </IconButton>
                      </Link>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                    <AccountCircle sx={{ mr: 1 }} />
                    <Typography>{activity.user?.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography>{dayjs(activity.createdAt).format(global.datetimeFormat)}</Typography>
                  </Box>
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{activity.description}</Typography>
                  <Link to={`/viewActivity/${activity.id}`} style={{ textDecoration: 'none' }}>
                    <Button size="small" sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                      View
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        
      </Container>
    </>
  );
}

export default Activities;
