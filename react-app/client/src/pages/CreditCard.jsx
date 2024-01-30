import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import http from '../http';

function CreditCard() {
    const [creditcardList, setcreditcardList] = useState([]);
    const [creditcardDelete, setcreditcardDelete] = useState(null);

    const getCreditCard = () => {
        http.get('/creditcard').then((res) => {
            setcreditcardList(res.data);
        });
    };

    useEffect(() => {
        getCreditCard();
    }, []); // Add the dependency array to run once when the component mounts

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Credit Card
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/addCreditCard" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add credit card
                    </Button>
                </Link>
            </Box>
            <Grid container spacing={2}>
                {creditcardList.map((creditcard) => (
                    <Grid item xs={12} md={6} lg={4} key={creditcard.id}>
                        <Card>
                            <CardContent>

                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        Credit Card
                                    </Typography>
                                    <Link to={`/updateCreditCard/${creditcard.id}`}>
                                        <IconButton color="primary" sx={{ padding: '4px' }}>
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                </Box>
                                <Typography>
                                    Card number: {creditcard.cardNumber}
                                </Typography>
                                <Typography>
                                    First name: {creditcard.firstName}
                                </Typography>
                                <Typography>
                                    Last name: {creditcard.lastName}
                                </Typography>
                                <Typography>
                                    City: {creditcard.city}
                                </Typography>
                                <Typography>
                                    Address: {creditcard.address}
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default CreditCard;
