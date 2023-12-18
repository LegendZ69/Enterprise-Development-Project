import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HomeIcon from '@mui/icons-material/Home';

function FormSuccess() {
    return (
        <Box sx={{ mt: 15, textAlign: 'center' }}>
            <Typography variant='h1' >
                <CheckCircleOutlineIcon fontSize='' color='success' />
            </Typography>
            <Typography gutterBottom variant='h2' sx={{ fontWeight: 'bold' }}>
                Form Has Been Submitted!
            </Typography>
            <Typography variant='h6'>
                Thank you for your feedback! We value your input and will use it to improve your experience.
            </Typography>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant='contained' sx={{ mt: 15, fontWeight: 'bold', borderRadius: 5, backgroundColor: 'black' }} startIcon={<HomeIcon />}>
                    Home
                </Button>
            </Link>
        </Box>
    )
}

export default FormSuccess