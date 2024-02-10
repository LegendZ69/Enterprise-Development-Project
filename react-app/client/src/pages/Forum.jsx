import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';

function ThreadList() {
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await http.get("/Thread");
        setThreads(response.data);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
        setError('Failed to load threads. Please try again later.');
      }
    };
    fetchThreads();
  }, []);

  const handleCreateThread = () => {
    navigate('/CreateThread');
  };

  // Styling
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
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
      display: 'block',
    },
    threadDescription: {
      fontSize: '14px', // Smaller than the title
      color: '#444',
      marginTop: '5px', // Adjusted spacing
    },
    threadMeta: {
      fontSize: '12px',
      color: '#666',
      fontStyle: 'italic',
      marginTop: '10px',
    },
    errorMessage: {
      color: 'red',
      textAlign: 'center',
    },
    createButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    container: {
      maxWidth: '960px',
      margin: '0 auto',
      padding: '20px',
    },
  };

  if (error) {
    return <div style={styles.errorMessage}>Failed to load threads. Please try again later.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Forum Threads</h1>
        {user && (
          <button onClick={handleCreateThread} style={styles.createButton}>
            Create New Thread
          </button>
        )}
      </div>
      {threads.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {threads.map((thread) => (
            <li key={thread.id} style={styles.threadCard}>
              <Link to={`/thread/${thread.id}`} style={styles.threadTitle}>
                {thread.title}
              </Link>
              <div style={styles.threadDescription}>
                {thread.description}
              </div>
              <div style={styles.threadMeta}>
                Posted by {thread.createdBy} on {formatDate(thread.createdDate)}
              </div>
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
