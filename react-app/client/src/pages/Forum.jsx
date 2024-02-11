import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../http';
import UserContext from '../contexts/UserContext';
import { FaArrowUp, FaArrowDown, FaComment } from 'react-icons/fa'; // Import icons
function ThreadList() {
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState({});
  const [voteType, setVoteType] = useState({});
  const [sortCriteria, setSortCriteria] = useState('replies');

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  const fetchThreads = async () => {
    try {
      const response = await http.get("/Thread");
      const threadsWithReplies = await Promise.all(response.data.map(async (thread) => {
        try {
          const repliesResponse = await http.get(`/Reply/${thread.id}`);
          return { ...thread, repliesCount: repliesResponse.data.length };
        } catch (error) {
          console.error('Failed to fetch replies for thread:', thread.id, error);
          return { ...thread, repliesCount: 'Error' }; // Handle error appropriately
        }
      }));
      setThreads(threadsWithReplies);
    } catch (error) {
      console.error('Failed to fetch threads:', error);
      setError('Failed to load threads. Please try again later.');
    }
  };

  const handleCreateThread = () => {
    navigate('/CreateThread');
  };
  const handleDeleteThread = async (threadId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this thread?");
    if (!isConfirmed) {
      console.log('Deletion canceled by user.'); // Log cancellation
      return; // Stop if the user cancels
    }

    try {
      console.log(`Attempting to delete thread with ID: ${threadId}`); // Log attempt
      const response = await http.delete(`/Thread/${threadId}`);
      console.log('Deletion response:', response); // Log response
      if (response) {
        alert('Thread deleted successfully');
        fetchThreads(); // Re-fetch threads to update the list
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
      alert('Error deleting thread');
    }
  };
  const handleVote = async (threadId, newVoteType) => {
    const currentVoteType = hasVoted[threadId] || 0;

    if (currentVoteType === newVoteType) {
      // User is reversing their vote.
      try {
        const reverseAction = currentVoteType === 1 ? 'downvote' : 'upvote';
        await http.post(`/Thread/${threadId}/${reverseAction}`);
        // Calculate the adjusted vote count.
        const adjustedVoteCount = currentVoteType === 1 ? -1 : 1; // If upvote was reversed, subtract one; if downvote was reversed, add one.
        updateThreadVotes(threadId, adjustedVoteCount, true); // Pass true to indicate this is a vote reversal.
        setHasVoted({ ...hasVoted, [threadId]: 0 }); // Reset vote state for this thread.
      } catch (error) {
        console.error(`Failed to reverse the vote on thread:`, error);
      }
    } else {
      // Voting for the first time or changing the vote.
      try {
        const action = newVoteType === 1 ? 'upvote' : 'downvote';
        const response = await http.post(`/Thread/${threadId}/${action}`);
        updateThreadVotes(threadId, newVoteType === 1 ? 1 : -1, false); // Update with +1 for upvote, -1 for downvote.
        setHasVoted({ ...hasVoted, [threadId]: newVoteType }); // Update vote state.
      } catch (error) {
        console.error(`Failed to ${newVoteType === 1 ? 'upvote' : 'downvote'} thread:`, error);
      }
    }
  };


  // Helper function to update thread votes in state
  // Adjusting vote count based on action; reversal indicates if the action is to reverse a vote.
  const updateThreadVotes = (threadId, voteChange, reversal) => {
    setThreads(threads.map(thread => {
      if (thread.id === threadId) {
        let newVoteCount = thread.votes;
        if (reversal) {
          // If reversing a vote, simply undo the previous vote.
          newVoteCount += voteChange; // voteChange correctly reflects +1 or -1 based on the vote being reversed.
        } else {
          // Apply the new vote change directly.
          newVoteCount += voteChange;
        }
        return { ...thread, votes: newVoteCount };
      }
      return thread;
    }));
  };
  const sortThreads = (criteria) => {
    const sortedThreads = [...threads].sort((a, b) => {
      if (criteria === 'replies') {
        return b.repliesCount - a.repliesCount; // Sort by replies count
      } else if (criteria === 'upvotes') {
        return b.votes - a.votes; // Sort by vote count
      }
      return 0;
    });

    setThreads(sortedThreads);
    setSortCriteria(criteria); // Update the sort criteria state
  };




  useEffect(() => {

    
    fetchThreads();
  }, []);






  // Styling
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    sortCreateContainer: {
      display: 'flex',
      justifyContent: 'flex-end', // Aligns items to the right
      alignItems: 'center',
      gap: '10px', // Adds some space between the sorting buttons and the create button
    },
    sortButton: {
      marginLeft: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: '#367c39',
      },
    },
    threadCard: {
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Original shadow
      margin: '0 0 20px',
      padding: '15px',
      transition: 'box-shadow 0.3s ease, transform 0.2s ease, outline 0.3s ease', // Add outline to the transition
      '&:hover': {
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)', // Larger, more prominent shadow
        transform: 'translateY(-2px)', // Slight upward movement
        outline: '#fa8128', // Orange outline
      },
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
      backgroundColor: '#a84c14',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      '&:hover': {
        backgroundColor: '#b55d25',
        transform: 'scale(1.05)',
      },
    },
    container: {
      maxWidth: '960px',
      margin: '0 auto',
      padding: '20px',
    },
    deleteButton: {
      marginLeft: 'auto', // Pushes the button to the right side
      backgroundColor: 'red', // Red fill
      color: 'white', // White text color for contrast
      border: '2px solid black', // Black outline for emphasis
      borderRadius: '5px',
      padding: '5px 10px',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    repliesCount: {
      marginLeft: 'auto', // Push the replies count to the right
      fontSize: '0.9rem', // Adjust font size as needed
      color: '#666', // Adjust color as needed
    },
    voteContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: '10px', // Adjust spacing as needed
    },
    voteIcon: {
      // Style for your vote icons, adjust as needed
      cursor: 'pointer',
      margin: '0 5px',
    },
    voteCount: {
      // Style for the vote count text, adjust as needed
    },

    // Add more styles as needed

  };

  if (error) {
    return <div style={styles.errorMessage}>Failed to load threads. Please try again later.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Forum Threads</h1>
        <div style={styles.sortCreateContainer}>
          <div>
            <button onClick={() => sortThreads('replies')} style={styles.sortButton}>
              Sort by Replies
            </button>
            <button onClick={() => sortThreads('upvotes')} style={styles.sortButton}>
              Sort by Upvotes
            </button>
          </div>
          {user && (
            <button onClick={handleCreateThread} style={styles.createButton}>
              Create New Thread
            </button>
          )}
        </div>
      </div>
      {threads.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {threads.map((thread) => (
            // Inside your component's return statement, within the map function that renders each thread

            <li key={thread.id} style={styles.threadCard}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <Link to={`/Thread/${thread.id}`} style={styles.threadTitle}>{thread.title}</Link>
                  <div style={styles.threadDescription}>{thread.description}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={styles.threadMeta}>
                    Posted by {thread.createdBy} on {formatDate(thread.createdDate)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaComment style={styles.voteIcon} />
                    <span style={styles.voteCount}>{thread.repliesCount}</span>
                    <div style={styles.voteContainer}>
                      <FaArrowUp
                        style={{
                          ...styles.voteIcon,
                          color: hasVoted[thread.id] === 1 ? '#ff4500' : 'gray', // Orange if upvoted, grey if not voted or vote reversed.
                        }}
                        onClick={() => handleVote(thread.id, 1)}
                      />

                      <span style={styles.voteCount}>{thread.votes}</span>

                      <FaArrowDown
                        style={{
                          ...styles.voteIcon,
                          color: hasVoted[thread.id] === -1 ? '#7193ff' : 'gray', // Blue if downvoted, grey if not voted or vote reversed.
                        }}
                        onClick={() => handleVote(thread.id, -1)}
                      />

                    </div>
                  </div>
                </div>
                {(user && (user.role === "admin" || user.id === thread.createdByUserId)) && (
                  <button onClick={() => handleDeleteThread(thread.id)} style={styles.deleteButton}>
                    Delete
                  </button>
                  
                )}

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