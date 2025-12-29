import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost, uploadImage } from '../services/postService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
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
        setCurrentImageUrl(data.cover_image_url);
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
    let imageUrl = currentImageUrl;
    let imagePublicId = null;

    if (newImageFile) {
      const uploadResponse = await uploadImage(newImageFile);
      imageUrl = uploadResponse.url;
      imagePublicId = uploadResponse.public_id;
    }

    await updatePost(id, { 
      title, 
      content, 
      cover_image_url: imageUrl,
      cover_image_public_id: imagePublicId 
    });
    
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
          <label htmlFor="title">Title:</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Cover Image:</label>
          {currentImageUrl && (
            <div style={{ marginBottom: '1rem' }}>
              <img src={currentImageUrl} alt="Current cover" style={{ width: '200px', height: 'auto' }} />
              <button type="button" onClick={() => setCurrentImageUrl(null)} style={{ marginLeft: '1rem', background: '#e74c3c' }}>
                Remove Image
              </button>
            </div>
          )}
          <input type="file" onChange={(e) => setNewImageFile(e.target.files[0])} accept="image/*" />
        </div>

        <div className="form-group">
          <label>Content:</label>
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Update Post</button>
      </form>
    </div>
  );
}

export default EditPost;