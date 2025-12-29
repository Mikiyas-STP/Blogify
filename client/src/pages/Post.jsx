import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost, getCommentsForPost, createComment, deleteComment, getReactionsForPost, toggleReaction } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

// NEW, BETTER version:
const REACTION_TYPES = [
  { name: 'like', emoji: '👍' },
  { name: 'love', emoji: '❤️' },
  { name: 'helpful', emoji: '💡' },
]; 

function Post() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); //New state for comments
  const [newComment, setNewComment] = useState(''); //New state for the comment form
  const [reactions, setReactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); //Get the current logged-in user from context

  //reusable function to fetch all data
  const fetchAllPostData = async () => {
    try {
      setLoading(true);
      const [postData, commentsData, reactionsData] = await Promise.all([
        getPostById(id),
        getCommentsForPost(id),
        getReactionsForPost(id)
      ]);
      setPost(postData);
      setComments(commentsData);
      setReactions(reactionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Use an effect to fetch both the post and its comments
 useEffect(() => {
    fetchAllPostData();
  }, [id]);

const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        navigate('/');
      } catch (err) { console.error(err); }
    }
  };
  // 5. New handler for submitting a comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // Don't submit empty comments

    try {
      const createdComment = await createComment(id, { content: newComment });
      // Add the new comment to the UI instantly
      setComments([...comments, createdComment]);
      setNewComment(''); // Clear the form
    } catch (err) {
      console.error('Failed to post comment:', err);
      // You could set an error state here
    }
  };

const handleDeleteComment = async (commentId) => {
  if (window.confirm('Are you sure you want to delete this comment?')) {
    try {
      await deleteComment(commentId);
      // This is an optimistic update: we remove the comment from the UI immediately.
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      // Optionally, show an error to the user
    }
  }
};
const handleReactionClick = async (reactionType) => {
    if (!user) {
      alert('You must be logged in to react.');
      return;
    }
    try {
      // Optimistically update the UI, then re-fetch for consistency
      await toggleReaction(id, reactionType);
      // Re-fetch all data to get the latest counts and user lists
      await fetchAllPostData();
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="post-full">
      <h1>{post.title}</h1>
      <p><em>by {post.username} on {new Date(post.created_at).toLocaleDateString()}</em></p>

      {post.cover_image_url && (
      <img 
        src={post.cover_image_url} 
        alt={`Cover for ${post.title}`} 
        style={{ width: '100%', height: 'auto', borderRadius: '8px', marginTop: '1.5rem' }} 
      />
    )}
      
      <div className="post-actions">
        <Link to={`/posts/${post.id}/edit`} className="button-edit">Edit Post</Link>
        <button onClick={handleDelete} className="button-delete">Delete Post</button>
      </div>

      <div className="post-content">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>


 // Replace the old reactions section in Post.jsx with this:

<div className="reactions-section">
  {REACTION_TYPES.map(reactionType => {
    // Find the data for this specific reaction from our state
    const reactionData = reactions.find(r => r.reaction_type === reactionType.name);
    
    // Get the count and the list of users who reacted
    const count = reactionData ? reactionData.count : 0;
    const usersWhoReacted = reactionData ? reactionData.users : [];

    // Check if the currently logged-in user has made this specific reaction
    const userHasReacted = user && usersWhoReacted.includes(user.username);

    return (
      <div 
        key={reactionType.name} 
        className="reaction-container"
        // The tooltip now shows a nicely formatted list of names
        title={count > 0 ? `Reacted by:\n${usersWhoReacted.join('\n')}` : `No ${reactionType.name} reactions yet`}
      >
        <button 
          onClick={() => handleReactionClick(reactionType.name)}
          // Dynamically add the 'reacted' class if the user has made this reaction
          className={`reaction-button ${userHasReacted ? 'reacted' : ''}`}
        >
          <span className="reaction-emoji">{reactionType.emoji}</span>
          <span className="reaction-count">{count}</span>
        </button>
      </div>
    );
  })}
</div>





      <hr />

      {/* --- NEW COMMENTS SECTION --- */}
      <div className="comments-section">
        <h2>Comments ({comments.length})</h2>
        
        {/* The list of existing comments */}
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <p className="comment-content">{comment.content}</p>
              <div className="comment-meta">
                <span>
                  by <strong>{comment.username}</strong> on {new Date(comment.created_at).toLocaleDateString()}
                </span>
                
                {/* THIS IS THE NEW PART: The Conditional Delete Button */}
                {user && user.username === comment.username && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)} 
                    className="button-delete-comment"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* The form to add a new comment */}
        {user ? ( // 6. Only show this form if the user is logged in
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <h3>Leave a Comment</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              required
            ></textarea>
            <button type="submit">Post Comment</button>
          </form>
        ) : (
          <p>You must be <Link to="/login">logged in</Link> to leave a comment.</p>
        )}
      </div>
    </div>
  );
}
export default Post;