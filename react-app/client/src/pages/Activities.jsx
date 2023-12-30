import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function Activities() {
    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Activities
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/addSuggestionForm" style={{ textDecoration: 'none' }}>
                    <Button variant="contained">
                        Suggest An Activity
                    </Button>
                </Link>
            </Box>

        </Box>

    )
}

export default Activities