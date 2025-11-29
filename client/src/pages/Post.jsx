import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from '../services/postService';

function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        navigate('/');
      } catch (err) { console.error(err); }
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="post-full">
      <h1>{post.title}</h1>
      <p><em>Published on: {new Date(post.created_at).toLocaleDateString()}</em></p>
      <div className="post-actions">
        <Link to={`/posts/${post.id}/edit`} className="button-edit">Edit Post</Link>
        <button onClick={handleDelete} className="button-delete">Delete Post</button>
      </div>
      <div className="post-content">
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
      </div>
    </div>
  );
}

export default Post;