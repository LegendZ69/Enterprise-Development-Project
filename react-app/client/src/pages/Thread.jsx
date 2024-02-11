// Import necessary hooks and dependencies
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';

function ThreadDetail() {
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [error, setError] = useState('');
  const { threadId } = useParams();
  const { user } = useContext(UserContext);
  // Add these styles inside your ThreadDetail component

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    background: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,.1)',
  },
  threadTitle: {
    fontSize: '24px',
    color: '#333',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  threadMeta: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: '20px',
  },
  threadContent: {
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  replyItem: {
    background: '#fff',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,.1)',
  },
  replyContent: {
    fontSize: '14px',
    marginBottom: '10px',
  },
  replyMeta: {
    fontStyle: 'italic',
    fontSize: '12px',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  textarea: {
    padding: '10px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minHeight: '100px',
  },
  submitButton: {
    padding: '10px 15px',
    fontSize: '16px',
    color: '#fff',
    background: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    alignSelf: 'start', // Align the button to the start of the form
  },
};

// Use these styles in your JSX like so: style={styles.container}
const fetchThreadAndReplies = async () => {
  try {
    const threadResponse = await http.get(`/Thread/${threadId}`);
    setThread(threadResponse.data);
    console.log(threadId)
    const repliesResponse = await http.get(`/Reply/${threadId}`); // Adjust endpoint as needed
    setReplies(repliesResponse.data);
    console.log(repliesResponse)
  } catch (error) {
    console.error('Failed to fetch thread or replies:', error);
    setError('Failed to load thread details or replies.');
  }
};
const handleReplySubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    alert("You must be logged in to post a reply.");
    return;
  }
  
    const response = await http.post('/Reply', {
      
      Content: newReply,
      ThreadId: threadId,
      CreatedBy: user.name, 
      CreatedByUserId: user.id,
      

    });
    if (response) {
      setNewReply('');
      setReplies([...replies, response.data]); // Append the new reply to the local state
      
      
    } else {
      alert('Failed to post reply');
    }
  
};
  useEffect(() => {
    

    fetchThreadAndReplies();
  }, [threadId]);

  

  if (error) {
    return <div>{error}</div>;
  }

  if (!thread) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.threadTitle}>{thread.title}</h1>
      <small style={styles.threadMeta}>Posted by {thread.createdBy} on {new Date(thread.createdDate).toLocaleString()}</small>
      <p style={styles.threadContent}>{thread.description}</p>
      <div>
        <h2>Replies</h2>
        {replies.map((reply) => (
          <div key={reply.id} style={styles.replyItem}>
            <p style={styles.replyContent}>{reply.content}</p>
            <small style={styles.replyMeta}>By {reply.createdBy} on {new Date(reply.createdDate).toLocaleString()}</small>
          </div>
        ))}
        {user && (
          <form onSubmit={handleReplySubmit} style={styles.form}>
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              required
              style={styles.textarea}
            />
            <button type="submit" style={styles.submitButton}>Post Reply</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ThreadDetail;