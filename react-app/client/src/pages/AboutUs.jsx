import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, CardMedia } from '@mui/material';
import { AccessTime, Search, Clear, Edit, Groups, SentimentSatisfiedAlt, AccessibilityNew, } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function AboutUs() {
    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                About Us
            </Typography>

            <Card sx={{ borderRadius: 2, boxShadow: 4, padding: 2 }}>
                <CardContent>
                    <Typography variant='h4' sx={{ textAlign: 'center' }} gutterBottom>
                        "You Play, We do the rest"
                    </Typography>
                    <Typography gutterBottom>
                        Established in 1986, NTUC Club is the leisure and entertainment arm of National Trades Union Congress (NTUC). As part of the Labour Movement, we are committed to the social mission of providing recreational experiences of choice for our members, guided by our core values of care, passion, trust and service.
                        Our key properties include NTUC Club @ SingPost Centre, and Downtown East.
                    </Typography>
                    <Typography gutterBottom>
                        With the newest addition, UPlay, a phygital (physical + digital) concierge of curatorial recreation experiences to enhance the social well-being of all workers. Specially curated from selected partners and cover a wide range of activities suitable for various ages and group sizes. From working adults who need a brief respite from the hustle and bustle of city life to parents who want to spend quality time with their little ones, there is something for everyone.
                    </Typography>
                    <Typography gutterBottom>
                        More than just a booking platform, UPlay aspires to connect people from all walks of life, forging new relationships over time as they find a common thread through shared interests. Union and companies can also join us in creating fun and engaging communities while cultivating deep connections and lifelong relationships.
                    </Typography>
                    <Typography>
                        Get ready to enrich the collective experience of life. Welcome to UPlay!
                    </Typography>
                </CardContent>
            </Card>

            <Box my={12} textAlign={'center'}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Our Mission
                </Typography>
                <Typography variant="h6">
                    To connect people from all walks of life and enrich their experiences by providing a curated platform for leisure and lifestyle activities.
                </Typography>

                <Grid container spacing={2} mt={6}>
                    <Grid item xs={4}>
                        <Groups />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Connecting people
                        </Typography>
                        <Typography>
                            Connecting people from diverse backgrounds together by participating in shared experiences and activities that transcend the ordinary.
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <SentimentSatisfiedAlt />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Enriching experiences
                        </Typography>
                        <Typography>
                            Enriching experiences through a wide array of curated activities suitable for various ages, interests, and group sizes.
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <AccessibilityNew />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Accessibility
                        </Typography>
                        <Typography>
                            Accessible for everyone by offering special rates and exclusive deals to NTUC union members and UPlay Friends.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={2} >
                <Grid item xs={6}>
                    <Card sx={{ boxShadow: 0, borderRadius: 2 }}>
                        <CardMedia
                            component="img"
                            image="src\assets\downtownEast.jpg"
                            alt="Downtown East"
                        />
                    </Card>
                </Grid>

                <Grid item xs={6}>
                    <Card sx={{ boxShadow: 0 }}>
                        <CardContent>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Downtown East
                            </Typography>
                            <Typography variant='body1' mt={2}>
                                Singapore's premier lifestyle, recreational and entertainment hub catering to the wide interests of modern youths and families.
                                Offering a multitude of lifestyle experiences including the country's first nature-inspired resort D'Resort, an expanded water park Wild Wild Wet, a myriad of retail dining and entertainment options at Market Square - E!Avenue and E!Hub, and union engagement amenities MUCE (Membership & Union Community Engagement).
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2} my={12}>
                <Grid item xs={6}>
                    <Card sx={{ boxShadow: 0 }}>
                        <CardContent>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Wild Wild Wet
                            </Typography>
                            <Typography variant='body1' mt={2}>
                                Singapore's largest water parks voted by you as the Top 10 in Asia on TripAdvisor. From adrenalin-pumping rides to relaxing ones, enjoy a fun-filled day in 7 attractions including the Royal Flush, Asia's first hybrid ride, and the Kraken Racers, Singapore's first four-lane mat racer slide. Dare yourself to go on the Torpedo or Free Fall for a mind-blowing experience. There are also rides for little ones at the Kidz Zone, ensuring that at its heart, Wild Wild Wet remains a family experience.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={6}>
                    <Card sx={{ boxShadow: 0, borderRadius: 5 }}>
                        <CardMedia
                            component="img"
                            image="src\assets\wildwildwet.jpg"
                            alt="Wild Wild Wet"
                        />
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2} >
                <Grid item xs={6}>
                    <Card sx={{ boxShadow: 0, borderRadius: 5 }}>
                        <CardMedia
                            component="img"
                            image="src\assets\dresort.jpg"
                            alt="D'Resort"
                        />
                    </Card>
                </Grid>

                <Grid item xs={6}>
                    <Card sx={{ boxShadow: 0 }}>
                        <CardContent>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                D'Resort
                            </Typography>
                            <Typography variant='body1' mt={2}>
                                Nature-inspired resort nestled in the lush greenery of Pasir Ris Park, providing guests a quiet yet contemporary staycation away from hectic city life. Offering 9 different room types cater to different needs and demographics for every budget and occasion. Complementing with unique park, mangrove and beach views, coupled with wide array of retail, dining and entertainment facilities, D'Resort is the go-to destination for corporate and family gatherings.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Box>
    )
}

export default AboutUs