import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, createPost } from '../services/postService';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const newPost = await createPost({ title: newTitle, content: newContent });
      setPosts([newPost, ...posts]);
      setNewTitle('');
      setNewContent('');
    } catch (err) { console.error(err); }
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
            <label>Title:</label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Content:</label>
            <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} required></textarea>
          </div>
          <button type="submit">Create Post</button>
        </form>
      </div>
      <hr />
      <div className="posts-list">
        <h2>All Posts</h2>
        {posts.map(post => (
          <div key={post.id} className="post-preview">
            <Link to={`/posts/${post.id}`}>
              <h3>{post.title}</h3>
            </Link>
            <p>Published on: {new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;