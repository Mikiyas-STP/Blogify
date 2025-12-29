import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../services/postService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, { title, content });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading post for editing...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Title:</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
          />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Update Post</button>
      </form>
    </div>
  );
}

export default EditPost;