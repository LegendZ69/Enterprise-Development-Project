import React, { useEffect, useState, useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,Avatar } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function AuditLog() {
    const [auditLogList, setAuditLogList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    if (!user || user.role !== "admin"){
        return (
            <Typography variant="h5" sx={{ my: 2 }}>
                Access denied. Only admins can view this page.
            </Typography>
        ); 
    }
    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getAudit = () => {
        http.get('/auditlog').then((res) => {
            setAuditLogList(res.data);
        });
    };
    const searchAudit = () => {
        http.get(`/auditlog?search=${search}`).then((res) => {
            setAuditLogList(res.data);
        });
    };
    useEffect(() => {
        getAudit();
    }, []);
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchAudit();
        }
    };

    const onClickSearch = () => {
        searchAudit();
    }

    const onClickClear = () => {
        setSearch('');
        getAudit();
    };




  return (
    <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
                Audit Logs
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    // You can add any user-related actions or buttons here
                }
            </Box>
            <Grid container spacing={2}>
                {
                    auditLogList.map((auditlog, i) => (
                        <Grid item xs={12} md={6} lg={4} key={auditlog.id}>
                            <Card>
                                
                            <CardContent className="card-content">
                  <Typography variant="h6" className="card-title">
                    {auditlog.action}
                  </Typography>
                  
                  <div className="card-details">
                      <Typography color="textSecondary">
                          Who did this: user id {auditlog.userId}
                      </Typography>
                      <Typography color="textSecondary">
                          When did this occur: {dayjs(auditlog.timestamp).format(global.datetimeFormat)}
                      </Typography>
                  </div>
                </CardContent>

                            </Card>
                        </Grid>
                    ))
                    
                }

            </Grid>

    </Box>

    )
}

export default AuditLog