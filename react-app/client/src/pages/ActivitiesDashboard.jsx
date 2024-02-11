import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, IconButton, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import http from '../http';

function ActivitiesDashboard() {
    const [activities, setActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 2;
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivities(currentPage);
    }, [currentPage]);
    
    const fetchActivities = (page) => {
        http.get(`/activity?page=${page}&pageSize=${pageSize}`)
            .then((res) => {
                setActivities(res.data); // Assuming res.data is an array of activities
                setTotalPages(res.totalPages);
            })
            .catch((error) => {
                console.error('Error fetching activities:', error.message);
            });
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleDeleteActivity = (id) => {
        http.delete(`/activity/${id}`)
            .then(() => {
                fetchActivities(currentPage);
                navigate("/activitiesDashboard");
            })
            .catch((error) => {
                console.error('Error deleting activity:', error.message);
            });
    };
    
    return (
        <div style={{ marginTop: '20px' }}>
            <Button variant="contained" component={Link} to="/addactivity">Add Activity</Button>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activities.map((activity) => (
                            <TableRow key={activity.id}>
                                <TableCell>{activity.title}</TableCell>
                                <TableCell>{activity.category}</TableCell>
                                <TableCell>{activity.user.name}</TableCell>
                                <TableCell>
                                    <IconButton component={Link} to={`/editactivity/${activity.id}`} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteActivity(activity.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={4}>
                                Showing {((currentPage - 1) * pageSize) + 1}-
                                {Math.min(currentPage * pageSize, activities.length)} of {activities.length} activities
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</Button>
                <Button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</Button>
            </div>
        </div>
    );
}

export default ActivitiesDashboard;
