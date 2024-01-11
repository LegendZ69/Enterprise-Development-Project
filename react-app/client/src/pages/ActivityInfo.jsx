import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

function ActivityInfo() {
    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                Activity Info
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Link to="/activities" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" startIcon={<ArrowBack />}>
                        Back to Activities
                    </Button>
                </Link>
            </Box>

            <Card sx={{ height: 250, backgroundColor: "grey" }}>
                <CardContent>
                    <Typography>wei hong's part to implement activity info, vincent's part to integrate reviews</Typography>
                </CardContent>
                
            </Card>

            <Typography variant='h2'>Reviews</Typography>

            <Grid item xs={12} md={6} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography sx={{ fontSize: '25px' }}>display reviews according to their activity.id after linking with wei hong. for now display all.</Typography>
                        </CardContent>
                    </Card>
            </Grid>

        </Box>

    )
}

export default ActivityInfo