import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, MenuItem, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-sg';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Delete as DeleteIcon } from '@mui/icons-material';

function AddActivity() {
    const [imageFile, setImageFile] = useState('');
    const [timeSlots, setTimeSlots] = useState([{ startTime: '', endTime: '' }]);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            price: '',
            category: '',
            eventDate: '',
            location: '',
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            price: yup.number().min(0, 'Price must be greater than or equal to 0'),
            category: yup.string().required('Category is required'),
            eventDate: yup.date().required('Event date is required'),
            location: yup.string().trim().required('Location is required'),
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();
            data.timeslots = timeSlots;
            console.log(data);
        }
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            setImageFile(file);
        }
    };

    const addTimeSlot = () => {
        setTimeSlots([...timeSlots, { startTime: '', endTime: '' }]);
    };

    const handleTimeSlotChange = (index, field, value) => {
        const updatedTimeSlots = [...timeSlots];
        updatedTimeSlots[index][field] = value;
        setTimeSlots(updatedTimeSlots);
    };

    const deleteTimeSlot = (index) => {
        const updatedTimeSlots = [...timeSlots];
        updatedTimeSlots.splice(index, 1);
        setTimeSlots(updatedTimeSlots);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 5 }}>
                Add Activity
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Price"
                            name="price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                        <TextField
                            fullWidth
                            select
                            margin="dense"
                            label="Category"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.category && Boolean(formik.errors.category)}
                            helperText={formik.touched.category && formik.errors.category}
                        >
                            <MenuItem value="" disabled>
                                Select a Category
                            </MenuItem>
                            <MenuItem value="sports">Sports</MenuItem>
                            <MenuItem value="leisure">Leisure</MenuItem>
                            <MenuItem value="family">Family</MenuItem>
                        </TextField>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-sg'>
                            <DatePicker
                                sx={{ width: '100%', marginBottom: '1rem' }}
                                margin="dense"
                                label="Event Date"
                                name="eventDate"
                                value={formik.values.eventDate}
                                onChange={(date) => formik.setFieldValue('eventDate', date)}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                                helperText={formik.touched.eventDate && formik.errors.eventDate}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        placeholder=""
                                        InputLabelProps={{ shrink: false }}
                                    />
                                }
                            />
                        

                        {/* Time Slots */}
                        {timeSlots.map((slot, index) => (
                            <Grid container spacing={2} key={index}>
                                <Grid item xs={5}>
                                    <TimePicker
                                        label={`Start Time Slot ${index + 1}`}
                                        value={slot.startTime}
                                        onChange={(value) => handleTimeSlotChange(index, 'startTime', value)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <TimePicker
                                        label={`End Time Slot ${index + 1}`}
                                        value={slot.endTime}
                                        onChange={(value) => handleTimeSlotChange(index, 'endTime', value)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => deleteTimeSlot(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button variant="outlined" onClick={addTimeSlot}>Add Time Slot</Button>
                        </LocalizationProvider>

                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Location"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            helperText={formik.touched.location && formik.errors.location}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                            </Button>
                            {imageFile && (
                                <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                    <img alt="image" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} />
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddActivity;
