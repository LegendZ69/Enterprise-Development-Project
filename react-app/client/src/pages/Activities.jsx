import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Container,
  Stack,
  CardMedia,
  InputBase,
} from "@mui/material";
import {
  Search,
  Clear,
  Event,
} from "@mui/icons-material";
import http from "../http";
import dayjs from "dayjs";
import UserContext from "../contexts/UserContext";
import "../css/activities.css";

function Activities() {
  const [activitiesList, setActivitiesList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useContext(UserContext);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const getActivities = () => {
    let url = "/activity";
    if (search) {
      url += `?search=${search}`;
    }

    if (selectedCategory !== "all") {
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
    if (e.key === "Enter") {
      getActivities();
    }
  };

  const onClickSearch = () => {
    getActivities();
  };

  const onClickClear = () => {
    setSearch("");
    getActivities();
  };

  return (
    <>
      {/* Search Bar and other stuff */}
      <Box sx={{ pt: 4, pb: 2, textAlign: "center", position: "relative" }}>
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
                width: "60%",
                height: "4rem",
                background: "#f5f5f5",
                borderRadius: "2rem",
                padding: "0 3.5rem 0 1.5rem",
                fontSize: "1rem",
                borderBottom: "none",
              }}
            />
            {search && ( 
              <>
                <IconButton
                  color="primary"
                  onClick={onClickClear}
                  sx={{ position: "absolute", marginLeft: "-7rem" }}
                >
                  <Clear />
                </IconButton>
              </>
            )}
            <IconButton
              color="primary"
              onClick={onClickSearch}
              sx={{ marginLeft: "-3.5rem" }}
            >
              <Search />
            </IconButton>
          </div>
        </div>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link to="/suggestionForm" style={{ textDecoration: "none" }}>
          <Button variant="contained">Suggest An Activity</Button>
        </Link>
      </Box>

      {/* Category Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant={selectedCategory === "all" ? "contained" : "outlined"}
          onClick={() => handleCategoryChange("all")}
        >
          All
        </Button>
        <Button
          variant={selectedCategory === "family" ? "contained" : "outlined"}
          onClick={() => handleCategoryChange("family")}
        >
          Family
        </Button>
        <Button
          variant={selectedCategory === "leisure" ? "contained" : "outlined"}
          onClick={() => handleCategoryChange("leisure")}
        >
          Leisure
        </Button>
        <Button
          variant={selectedCategory === "sports" ? "contained" : "outlined"}
          onClick={() => handleCategoryChange("sports")}
        >
          Sports
        </Button>
      </Stack>

      <Container sx={{ py: 8, maxWidth: "md" }}>
        {/* <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {user && (
            <Link to="/addActivity" style={{ textDecoration: "none" }}>
              <Button variant="contained">Add</Button>
            </Link>
          )}
        </Box> */}

        <Grid container spacing={4}>
          {activitiesList.map((activity) => (
            <Grid item key={activity.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
                className="card-container"
              >
                {activity.imageFile && (
                  <CardMedia
                    component="div"
                    className="card-img"
                    sx={{
                      pt: "55%",
                    }}
                    image={`${import.meta.env.VITE_FILE_BASE_URL}${
                      activity.imageFile
                    }`}
                  />
                )}
                <CardContent
                  className="card-content"
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography variant="h6" className="card-title">
                    {activity.title}
                    {/* {user && user.id === activity.userId && (
                      <Link to={`/editActivity/${activity.id}`}>
                        <IconButton color="primary" sx={{ padding: "4px" }}>
                          <Edit />
                        </IconButton>
                      </Link>
                    )} */}
                  </Typography>

                  <div className="card-details" sx={{ flexGrow: 1 }}>
                    <Typography color="textSecondary" sx={{ marginBottom: 1 }}>
                      <Event fontSize="small" sx={{ marginRight: 1 }} />
                      {dayjs(activity.eventDate).format("DD/MM/YYYY")}
                    </Typography>

                    <Typography
                      variant="body"
                      color="textSecondary"
                      sx={{ marginBottom: 1 }}
                    >
                      Price: <strong>${activity.price}</strong>
                    </Typography>
                  </div>

                  <Link
                    to={`/viewActivity/${activity.id}`}
                    className="card-btn"
                    sx={{ alignSelf: "flex-start", mt: "auto" }}
                  >
                    View
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
