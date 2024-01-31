import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import { AccessTime, Search, Clear, Edit, NavigateBefore, NavigateNext } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function Home() {
    const myStyle = {
        backgroundImage:
            "url('https://media.geeksforgeeks.org/wp-content/uploads/rk.png')",
        height: "100vh",
        marginTop: "-70px",
        fontSize: "50px",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    return (
        <Box>
            <Box component='div' className="bgImg">
                <Typography variant='h2'>Lorem ipsum</Typography>
            </Box>

            <Typography variant='h4' sx={{ mt: 12, textAlign: 'center', fontWeight: 'bold' }} gutterBottom>Relieve those moments again (past bookings)</Typography>
            <Grid container spacing={12}>
                <Grid item xs={4}>item 1</Grid>
                <Grid item xs={4}>item 2</Grid>
                <Grid item xs={4}>item 3</Grid>
            </Grid>

            <Typography variant='h4' sx={{ mt: 12, textAlign: 'center', fontWeight: 'bold' }} gutterBottom>Our top picks!</Typography>
            <Grid container spacing={12}>
                <Grid item xs={4}>item 1</Grid>
                <Grid item xs={4}>item 2</Grid>
                <Grid item xs={4}>item 3</Grid>
            </Grid>

            <Typography variant='h4' sx={{ mt: 12, textAlign: 'center', fontWeight: 'bold' }} gutterBottom>Offers of your desire</Typography>
            <Grid container spacing={12}>
                <Grid item xs={4}>offer 1</Grid>
                <Grid item xs={4}>offer 2</Grid>
                <Grid item xs={4}>offer 3</Grid>
            </Grid>

            <Typography variant='h4' sx={{ mt: 12, textAlign: 'center', fontWeight: 'bold' }} gutterBottom>Become a UPlay Friends</Typography>
            <Grid container spacing={12}>
                <Grid item xs={4}>benefits 1</Grid>
                <Grid item xs={4}>benefits 2</Grid>
                <Grid item xs={4}>benefits 3</Grid>
            </Grid>
        </Box>


    )
}

export default Home