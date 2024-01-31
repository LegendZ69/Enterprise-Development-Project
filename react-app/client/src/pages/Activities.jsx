import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';

function Activities() {
    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Activities
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/suggestionForm" style={{ textDecoration: 'none' }}>
                    <Button variant="contained">
                        Suggest An Activity
                    </Button>
                </Link>
            </Box>

            <Grid item xs={12} md={6} lg={4}>
                <Link to="/activityInfo" style={{ textDecoration: 'none' }}>
                    <Card>
                    <CardContent>
                            <Typography sx={{ fontSize: '25px' }}>activity 1 placeholder</Typography>
                    </CardContent>
                </Card>
                </Link>
                
            </Grid>

        </Box>

    )
}

export default Activities