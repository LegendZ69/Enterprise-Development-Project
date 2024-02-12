import React, { useEffect, useState, useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
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
    Avatar,
    Input
  } from '@mui/material';
  import {
      MDBCol,
      MDBContainer,
      MDBRow,
      MDBCard,
      MDBCardText,
      MDBCardBody,
      MDBBtn,
      MDBBreadcrumb,
      MDBBreadcrumbItem,
      MDBIcon,
      MDBListGroup,
      MDBListGroupItem,
    } from "mdb-react-ui-kit";
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import FilterListIcon from '@mui/icons-material/FilterList';

function AuditLog() {
    const [auditLogList, setAuditLogList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState(null);
    const [orderBy, setOrderBy] = useState("");
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);




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
    const getUserProfile = () => {
        if (user) {
            http.get(`/user/${user.id}`).then((res) => {
                setUserProfile(res.data);
            });
        }
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
        getUserProfile();
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

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelected = auditLogList.map((log) => log.id);
          setSelected(newSelected);
          return;
        }
        setSelected([]);
      };
    
      const handleClick = (event, id) => {
        if (!event.target.closest("button")) {
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
              selected.slice(selectedIndex + 1)
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
      const filteredAuditLog = auditLogList.filter(
        (log) =>
          log.action.toLowerCase().includes(search.toLowerCase()) ||
          log.userId.toString().includes(search.toLowerCase()) ||
          new Date(log.timestamp)
            .toLocaleDateString("en-SG")
            .includes(search.toLowerCase())
      );
        


  return (
    // <Box>
    //     <Typography variant="h5" sx={{ my: 2 }}>
    //             Audit Logs
    //     </Typography>

    //     <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    //             <Input value={search} placeholder="Search"
    //                 onChange={onSearchChange}
    //                 onKeyDown={onSearchKeyDown} />
    //             <IconButton color="primary"
    //                 onClick={onClickSearch}>
    //                 <Search />
    //             </IconButton>
    //             <IconButton color="primary"
    //                 onClick={onClickClear}>
    //                 <Clear />
    //             </IconButton>
    //             <Box sx={{ flexGrow: 1 }} />
    //             {
    //                 // You can add any user-related actions or buttons here
    //             }
    //         </Box>
    //         <Grid container spacing={2}>
    //             {
    //                 auditLogList.map((auditlog, i) => (
    //                     <Grid item xs={12} md={6} lg={4} key={auditlog.id}>
    //                         <Card>
                                
    //                         <CardContent className="card-content">
    //               <Typography variant="h6" className="card-title">
    //                 {auditlog.action}
    //               </Typography>
                  
    //               <div className="card-details">
    //                   <Typography color="textSecondary">
    //                       Who did this: user id {auditlog.userId}
    //                   </Typography>
    //                   <Typography color="textSecondary">
    //                       When did this occur: {dayjs(auditlog.timestamp).format(global.datetimeFormat)}
    //                   </Typography>
    //               </div>
    //             </CardContent>

    //                         </Card>
    //                     </Grid>
    //                 ))
                    
    //             }

    //         </Grid>

    // </Box>
<section>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>
                <a href="/">Home</a>
              </MDBBreadcrumbItem>
              <MDBBreadcrumbItem active>
                <a href="/profile">User</a>
              </MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>
        {userProfile ? (
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  <div className="d-flex justify-content-center mb-4">
                    <Avatar
                      alt="Profile Picture"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${
                        userProfile.imageFile
                      }`}
                      sx={{ width: 300, height: 300, borderRadius: "50%" }}
                    />
                  </div>
                  <p className="text-muted mb-1">Name: {userProfile.name}</p>
                  <p className="text-muted mb-1">Role: {userProfile.role}</p>
                  <p className="text-muted mb-1">
                    User Status: {userProfile.status}
                  </p>
                  <p className="text-muted mb-1">
                    User since{" "}
                    {dayjs(userProfile.createdAt).format("YYYY-MM-DD")}
                  </p>

                  <div className="d-flex justify-content-center mb-2">
                    <Link
                      to={`/editprofile/${user.id}`}
                      style={{ marginRight: "10px" }}
                    >
                      <MDBBtn>Edit Profile</MDBBtn>
                    </Link>
                    <Link
                      to="/changepassword"
                      style={{ marginRight: "10px", textDecoration: "none" }}
                    >
                      <MDBBtn>Change Password</MDBBtn>
                    </Link>
                  </div>
                </MDBCardBody>
              </MDBCard>

              <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                  <MDBListGroup flush className="rounded-3">
                    {user && user.role === "admin" && (
                      <>
                        <Link to={`/profile`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="chart-line" style={{ color: '#333333' }}/>
                        <MDBCardText>Profile</MDBCardText>
                    </MDBListGroupItem>
                    </Link>

                <Link to={`/activitiesDashboard`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="chart-line" style={{ color: '#333333' }} />
                            <MDBCardText>Activities Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/bookingsDashboard`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="quran" style={{ color: '#333333' }} />
                            <MDBCardText>Bookings Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displaySuggestionForm`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="lightbulb" style={{ color: '#333333' }} />
                            <MDBCardText>Suggestions Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displayFeedbackForm`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="comment" style={{ color: '#333333' }} />
                            <MDBCardText>Feedbacks Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displayRatingsAndReviews`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="star" style={{ color: '#333333' }} />
                            <MDBCardText>Ratings Dashboard</MDBCardText>
                          </MDBListGroupItem>
                        </Link>
                        
                        <Link to={`/users`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="user-injured" style={{ color: '#333333' }} />
                            <MDBCardText>Users</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/auditlog`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="paperclip" style={{ color: '#333333' }} />
                            <MDBCardText>Audit Log</MDBCardText>
                          </MDBListGroupItem>
                        </Link>
                        <Link to={`/coupons`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                          <MDBIcon fas icon="ticket-alt" style={{ color: '#333333' }}/>
                            <MDBCardText>Coupons</MDBCardText>
                          </MDBListGroupItem>
                        </Link>
                      </>
                    )}

                    {user && user.role === "user" && (
                      <>
                        <Link to={`/profile`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="chart-line" style={{ color: '#333333' }}/>
                        <MDBCardText>Profile</MDBCardText>
                    </MDBListGroupItem>
                    </Link>
                    
                    <Link to={`/creditcard`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                  <MDBIcon fas icon="credit-card"style={{ color: '#333333' }} />
                        <MDBCardText>Credit Cards</MDBCardText>
                    </MDBListGroupItem>
                    </Link>

                        <Link to={`/userbookings`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fas icon="history" style={{ color: '#333333' }} />
                            <MDBCardText>Bookings</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displaySuggestionForm`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="lightbulb" style={{ color: '#333333' }} />
                            <MDBCardText>Suggestions</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displayFeedbackForm`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="comment" style={{ color: '#333333' }} />
                            <MDBCardText>Feedbacks</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/displayRatingsAndReviews`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon far icon="star" style={{ color: '#333333' }} />
                            <MDBCardText>Ratings</MDBCardText>
                          </MDBListGroupItem>
                        </Link>

                        <Link to={`/Forum`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                            <MDBIcon fab icon="rocketchat" style={{ color: '#333333' }} />

                            <MDBCardText>Forum</MDBCardText>
                          </MDBListGroupItem>
                        </Link>
                      </>
                    )}
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <Paper sx={{ width: "100%", mb: 2 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" id="tableTitle" component="div">
                      Audit Logs
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                        id="search"
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={search}
                        placeholder="Search"
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                        />
                    <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
        </IconButton>

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
                    
                  <TableCell>Log Id</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Timestamp</TableCell>
                  {/* Add additional table header cells as needed */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAuditLog
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log) => {
                    const isItemSelected = isSelected(log.id);
                    const labelId = `audit-log-checkbox-${log.id}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, log.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={log.id}
                        selected={isItemSelected}
                      >
                        
                        <TableCell>{log.id}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>
                          {log.timestamp}
                        </TableCell>

                        {/* Add additional table cells for more details */}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 25, 100]}
            component="div"
            count={filteredAuditLog.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
              </Paper>
            </MDBCol>
          </MDBRow>
        ) : (
          <Typography variant="body1">Loading audit log...</Typography>
        )}
      </MDBContainer>

    </section>
    )
}

export default AuditLog