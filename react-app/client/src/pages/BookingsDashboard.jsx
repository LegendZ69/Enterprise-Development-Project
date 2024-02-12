import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import http from '../http';

function BookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBookingId, setDeleteBookingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    http.get(`/booking/adminBookings`)
      .then((res) => {
        setBookings(res.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error.message);
      });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = bookings.map((booking) => booking.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    if (!event.target.closest('button')) {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDeleteBooking = () => {
    http.delete(`/booking/${deleteBookingId}`)
      .then(() => {
        fetchBookings();
        setDeleteDialogOpen(false);
        setDeleteBookingId(null);
        navigate("/bookingsDashboard");
      })
      .catch((error) => {
        console.error('Error deleting booking:', error.message);
      });
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.id.toString().includes(searchTerm.toLowerCase()) ||
    booking.activityId.toString().includes(searchTerm.toLowerCase()) ||
    booking.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userId.toString().includes(searchTerm.toLowerCase()) ||
    booking.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', paddingTop: 10 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" id="tableTitle" component="div">
              Bookings Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="search"
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Tooltip title="Filter list">
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredBookings.length}
                    checked={filteredBookings.length > 0 && selected.length === filteredBookings.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all bookings' }}
                  />
                </TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Activity ID</TableCell>
                <TableCell>Activity Name</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => {
                const isItemSelected = isSelected(booking.id);
                const labelId = `enhanced-table-checkbox-${booking.id}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, booking.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={booking.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.activityId}</TableCell>
                    <TableCell>{booking.activityTitle}</TableCell>
                    <TableCell>{booking.userId}</TableCell>
                    <TableCell>{booking.user.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => {
                        setDeleteBookingId(booking.id);
                        setDeleteDialogOpen(true);
                      }} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteBooking} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BookingsDashboard;
