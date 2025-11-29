import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../services/postService';

function EditPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]); //Re-fetch when ID changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, { title, content });
      navigate('/'); //Go to homepage to force a re-fetch of the list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group"><label>Title:</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div className="form-group"><label>Content:</label><textarea value={content} onChange={(e) => setContent(e.target.value)} required></textarea></div>
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default EditPost;