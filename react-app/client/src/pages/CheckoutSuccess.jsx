import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function CheckoutSuccess() {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                You have successfully booked the activities!
            </Typography>
            <Button variant="contained" component={Link} to="/activities">
                Return to Homepage
            </Button>
        </div>
    );
}

export default CheckoutSuccess;
