// ThreadDetails.jsx
function ThreadDetails({ threadId, setReplies }) {
    const [thread, setThread] = useState(null);
    const [replies, setReplies] = useState([]);
    const [newReplyContent, setNewReplyContent] = useState('');
  
    useEffect(() => {
      fetchThreadAndReplies(threadId);
    }, [threadId]);
  
    const fetchThreadAndReplies = async (id) => {
      // ... fetch data from API, update state
    };
  
    const handleAddReply = async (e) => {
      e.preventDefault();
      // ... send POST request to add reply, update state
    };
  
    // ... render thread details and reply list, AddReply form
  
    return (
      <div>
        {/* ... thread details */}
        <h2>Replies</h2>
        <ul>
          {replies.map((reply) => (
            <li key={reply.id}>{reply.content} - {reply.createdBy}</li>
          ))}
        </ul>
        <AddReply threadId={threadId} onReplyAdded={setReplies} content={newReplyContent} setContent={setNewReplyContent} />
      </div>
    );
  }
  
  // AddReply.jsx
  function AddReply({ threadId, onReplyAdded, content, setContent }) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      // ... send POST request to add reply, update state in parent
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">Add Reply</button>
      </form>
    );
  }