import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HomeIcon from '@mui/icons-material/Home';

function SuggestionSuccess() {
    return (
        <Box sx={{ mt: 15, textAlign: 'center' }}>
            <Typography variant='h1' >
                <CheckCircleOutlineIcon fontSize='' color='success' />
            </Typography>
            <Typography gutterBottom variant='h2' sx={{ fontWeight: 'bold' }}>
                Suggestion Has Been Submitted!
            </Typography>
            <Typography variant='h6'>
                Thank you for your suggestion! We will take into considerations and implement it in the near future.
            </Typography>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant='contained' sx={{ mt: 15, fontWeight: 'bold', borderRadius: 5 }} startIcon={<HomeIcon />}>
                    Home
                </Button>
            </Link>
        </Box>
    )
}

export default SuggestionSuccess