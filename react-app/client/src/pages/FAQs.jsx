import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


function FAQs() {
    return (
        <Box>
            <Typography variant="h1" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold' }}>
                <QuestionAnswerIcon fontSize='' /> FAQs
            </Typography>

            <Accordion disableGutters>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography variant='h6' fontWeight={'bold'}>What is UPlay Friends?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        UPlay Friends is an exclusive membership you unlock after your first paid booking, providing the same benefits as a NTUC Club member such as exclusive discounts, "Friends of UPlay" member rate, birthday rewards and many more!
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ my: 4 }} disableGutters>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography variant='h6' fontWeight={'bold'}>What are the accepted payment methods?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        You can pay for your UPlay experiences using major credit cards and debit cards. Currently, cash payments and e-wallets are not accepted.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ my: 4 }} disableGutters>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                >
                    <Typography variant='h6' fontWeight={'bold'}>Can I cancel or reschedule my bookings?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Most bookings allow for cancellation or rescheduling, but the specific policy depends on the experience you choose. Always check the individual experience's cancellation policy before booking to understand the timeframe and any potential fees involved.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ my: 4 }} disableGutters>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel4-content"
                    id="panel4-header"
                >
                    <Typography variant='h6' fontWeight={'bold'}>What happens if the activity is cancelled?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        If the activity provider cancels the experience, you will receive a full refund of your booking amount. UPlay will notify you as soon as they are informed of the cancellation.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel5-content"
                    id="panel5-header"
                >
                    <Typography variant='h6' fontWeight={'bold'}>How can I get in contact with UPlay customer service?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Simply email us at <a href='mailto:sales@uplay.com.sg'>sales@uplay.com.sg</a>, or call us at <a href='tel:+6568288383'>+65 6828 8383</a> or drop a message to us via the <Link to="/feedbackForm">Contact Us Page</Link> .
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

export default FAQs