import React, { useEffect, useState, useContext } from 'react';
import { Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function ViewPayments() {
    const { user } = useContext(UserContext);
    const [payments, setPayments] = useState([]);
    const [deletePaymentId, setDeletePaymentId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        http.get('/Payments')
            .then((res) => {
                const allPayments = res.data;
                const userPayments = allPayments.filter(payment => payment.userId === user.id);
                setPayments(userPayments);
            })
            .catch((error) => {
                console.error('Failed to fetch payments:', error.message);
            });
    }, [user]);

    const handleOpenDeleteDialog = (paymentId) => {
        setDeletePaymentId(paymentId);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeletePaymentId(null);
        setOpenDeleteDialog(false);
    };

    const handleDeletePayment = () => {
        if (deletePaymentId) {
            // Make a DELETE request to delete the payment with the given ID
            http.delete(`/Payments/${deletePaymentId}`)
                .then(() => {
                    // Remove the deleted payment from the state
                    setPayments(prevPayments => prevPayments.filter(payment => payment.id !== deletePaymentId));
                    handleCloseDeleteDialog();
                })
                .catch((error) => {
                    console.error('Failed to delete payment:', error.message);
                });
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Payments
            </Typography>
            {payments.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Activity Title</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Booked Date</TableCell>
                                <TableCell>Action</TableCell> {/* New table cell for the delete button */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.activityTitle}</TableCell>
                                    <TableCell>${payment.price}</TableCell>
                                    <TableCell>{payment.bookedDate}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleOpenDeleteDialog(payment.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">
                    No payments found.
                </Typography>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete Payment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this payment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDeletePayment} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ViewPayments;

