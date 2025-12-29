import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, createPost, uploadImage } from '../services/postService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  
const handleCreatePost = async (e) => {
  e.preventDefault();
  try {
    let coverImageUrl = null; // 1. Default to null

    // 2. If a file was selected, upload it first
    if (imageFile) {
      const uploadResponse = await uploadImage(imageFile);
      coverImageUrl = uploadResponse.url;
    }

    // 3. Create the post with the (potentially null) image URL
    await createPost({ 
      title: newTitle, 
      content: newContent,
      cover_image_url: coverImageUrl,
    });

    // 4. Refresh and clear the form (this logic is the same)
    await fetchPosts();
    setNewTitle('');
    setNewContent('');
    setImageFile(null);
    document.getElementById('imageUploadInput').value = null;

  } catch (err) { 
    console.error("Failed to create post:", err);
  }
};


  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Blog</h1>
      <div className="form-container">
        <h2>Create New Post</h2>
        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <label htmlFor="newTitle">Title:</label>
            <input 
              type="text"
              id="newTitle"
              name="newTitle"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="imageUploadInput">Cover Image:</label>
            <input 
              type="file" 
              id="imageUploadInput"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="form-group">
            <label>Content:</label>
            <ReactQuill 
              theme="snow"
              value={newContent}
              onChange={setNewContent}
            />
          </div>
          <button type="submit" style={{ marginTop: '1rem' }}>Create Post</button>
        </form>
      </div>
      <hr />
            <div className="posts-list">
        <h2>All Posts</h2>
        {posts.map(post => (
          <div key={post.id} className="post-preview">
             {post.cover_image_url && (
        <Link to={`/posts/${post.id}`}>
          <img 
            src={post.cover_image_url} 
            alt={`Cover for ${post.title}`} 
            style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }} 
          />
        </Link>
      )}
            <Link to={`/posts/${post.id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>by {post.username} on {new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;