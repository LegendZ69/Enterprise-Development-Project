import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import http from '../http'; // Ensure this points to your correct http service

function ThreadList() {
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await http.get("/Thread"); // Ensure this endpoint is correct
        setThreads(response.data); // Adjust according to your data structure
      } catch (error) {
        console.error('Failed to fetch threads:', error);
        setError('Failed to load threads. Please try again later.');
      }
    };
    fetchThreads();
  }, []);

  // Styling
  const styles = {
    // Container style remains the same
    threadCard: {
      background: '#FFF',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '0 0 20px',
      padding: '15px',
      transition: 'box-shadow 0.3s ease',
      '&:hover': {
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      }
    },
    threadTitle: {
      color: '#333',
      textDecoration: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      display: 'block', // Makes the whole area clickable
    },
    threadMeta: {
      fontSize: '14px',
      color: '#666',
      fontStyle: 'italic',
    },
    threadDescription: {
      marginTop: '10px',
      fontSize: '16px',
      color: '#444',
    },
    errorMessage: {
      color: 'red',
      textAlign: 'center',
    }
  };

  if (error) {
    return <div style={styles.errorMessage}>Failed to load threads. Please try again later.</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Forum Threads</h1>
      {threads.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {threads.map((thread) => (
            <li key={thread.id} style={styles.threadCard}>
              <Link to={`/thread/${thread.id}`} style={styles.threadTitle}>
                {thread.title}
              </Link>
              <div style={styles.threadMeta}>
                Posted by {thread.createdBy} on {new Date(thread.createdAt).toLocaleDateString()}
              </div>
              <div style={styles.threadDescription}>{thread.description}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No threads to display.</p>
      )}
    </div>
  );
}

export default ThreadList;
