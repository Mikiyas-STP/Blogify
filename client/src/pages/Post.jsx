import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost, getCommentsForPost, createComment, deleteComment, getReactionsForPost, toggleReaction } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

const REACTION_TYPES = [ { name: 'like', emoji: '👍' }, { name: 'love', emoji: '❤️' }, { name: 'helpful', emoji: '💡' } ];
const INITIAL_VISIBLE_COMMENTS = 3;

function Post() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [reactions, setReactions] = useState([]);
  const [visibleComments, setVisibleComments] = useState(INITIAL_VISIBLE_COMMENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchAllPostData = async () => {
    try {
      setLoading(true);
      const [postData, commentsData, reactionsData] = await Promise.all([
        getPostById(id), getCommentsForPost(id), getReactionsForPost(id)
      ]);
      setPost(postData);
      setComments(commentsData);
      setReactions(reactionsData);
    } catch (err) { setError(err.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAllPostData(); }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try { await deletePost(id); navigate('/'); } 
      catch (err) { console.error(err); }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const createdComment = await createComment(id, { content: newComment });
      setComments([createdComment, ...comments]);
      setNewComment('');
    } catch (err) { console.error('Failed to post comment:', err); }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err) { console.error('Failed to delete comment:', err); }
    }
  };

  const handleReactionClick = async (reactionType) => {
    if (!user) return alert('You must be logged in to react.');
    const originalReactions = [...reactions];
    try {
      // This is the full optimistic update logic
      const userReactionIndex = reactions.findIndex(r => r.users.includes(user.username));
      const newReactions = JSON.parse(JSON.stringify(reactions));
      if (userReactionIndex > -1) {
        const existing = newReactions[userReactionIndex];
        existing.count = String(parseInt(existing.count) - 1);
        existing.users = existing.users.filter(u => u !== user.username);
        if (existing.reaction_type !== reactionType) {
          const targetReaction = newReactions.find(r => r.reaction_type === reactionType);
          if (targetReaction) {
            targetReaction.count = String(parseInt(targetReaction.count) + 1);
            targetReaction.users.push(user.username);
          } else {
            newReactions.push({ reaction_type: reactionType, count: '1', users: [user.username] });
          }
        }
      } else {
        const targetReaction = newReactions.find(r => r.reaction_type === reactionType);
        if (targetReaction) {
          targetReaction.count = String(parseInt(targetReaction.count) + 1);
          targetReaction.users.push(user.username);
        } else {
          newReactions.push({ reaction_type: reactionType, count: '1', users: [user.username] });
        }
      }
      setReactions(newReactions.filter(r => parseInt(r.count) > 0));
      await toggleReaction(id, reactionType);
    } catch (err) { console.error('Failed to react:', err); setReactions(originalReactions); }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="post-full">
      <h1>{post.title}</h1>
      <p><em>by {post.username} on {new Date(post.created_at).toLocaleDateString()}</em></p>
      {post.cover_image_url && <img src={post.cover_image_url} alt={`Cover for ${post.title}`} style={{ width: '100%', height: 'auto', borderRadius: '8px', marginTop: '1.5rem' }} />}
      {user && user.username === post.username && (
        <div className="post-actions">
          <Link to={`/posts/${id}/edit`} className="button-edit">Edit Post</Link>
          <button onClick={handleDelete} className="button-delete">Delete Post</button>
        </div>
      )}
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="post-footer">
        <div className="reactions-section">
          {REACTION_TYPES.map(reactionType => {
            const reactionData = reactions.find(r => r.reaction_type === reactionType.name);
            const count = reactionData ? reactionData.count : 0;
            const usersWhoReacted = reactionData ? reactionData.users : [];
            const userHasReacted = user && usersWhoReacted.includes(user.username);
            return (
              <div key={reactionType.name} className="reaction-container" title={count > 0 ? `Reacted by:\n${usersWhoReacted.join('\n')}` : ''}>
                <button onClick={() => handleReactionClick(reactionType.name)} className={`reaction-button ${userHasReacted ? 'reacted' : ''}`}>
                  <span className="reaction-emoji">{reactionType.emoji}</span>
                  <span className="reaction-count">{count}</span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>
          {user ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." required></textarea>
              <button type="submit">Post</button>
            </form>
          ) : (
            <p style={{ marginTop: '2rem' }}><Link to="/login">Log in</Link> to join the conversation.</p>
          )}
          <div className="comments-list">
            {comments.slice(0, visibleComments).map(comment => (
              <div key={comment.id} className="comment">
                <p className="comment-meta"><strong>{comment.username}</strong></p>
                <p className="comment-content">{comment.content}</p>
                {user && user.username === comment.username && (
                  <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                    <button onClick={() => handleDeleteComment(comment.id)} className="button-delete-comment">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {comments.length > visibleComments && (
            <button onClick={() => setVisibleComments(prev => prev + 5)} className="load-more-button">Load More Comments</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;