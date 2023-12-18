import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import http from '../http';

export default function FeedbackForm() {
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Feedback Form
            </Typography>
        </Box>
    )
}
