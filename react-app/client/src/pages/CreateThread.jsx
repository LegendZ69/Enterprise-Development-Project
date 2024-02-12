import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';

function CreateThread() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Styling
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      background: '#fff',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      marginBottom: '10px',
    },
    textarea: {
      width: '100%',
      height: '150px',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      background: '#4CAF50',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to create a thread.");
      return;
    }

    try {
      const response = await http.post('/Thread', { title, description, createdBy: user.name ,createdByUserId: user.id});
      if (response.status === 201) {
        alert('Thread created successfully!');
        navigate('/Forum'); // Adjust as needed
      } else {
        alert('Failed to create thread');
      }
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Error creating thread');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Create New Thread</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.textarea}
          />
        </div>
        <button type="submit" style={styles.button}>Create Thread</button>
      </form>
    </div>
  );
}

export default CreateThread;