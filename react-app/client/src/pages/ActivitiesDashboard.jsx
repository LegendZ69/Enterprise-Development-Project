import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, IconButton, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import http from '../http';

function ActivitiesDashboard() {
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivities();
    }, []);
    
    const fetchActivities = () => {
        http.get('/activity')
            .then((res) => {
                setActivities(res.data);
            })
            .catch((error) => {
                console.error('Error fetching activities:', error.message);
            });
    };
    
    const handleDeleteActivity = (id) => {
        http.delete(`/activity/${id}`)
            .then(() => {
                fetchActivities();
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
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activities.map((activity) => (
                            <TableRow key={activity.id}>
                                <TableCell>{activity.title}</TableCell>
                                <TableCell>{activity.description}</TableCell>
                                <TableCell>{activity.category}</TableCell>
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
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default ActivitiesDashboard;
