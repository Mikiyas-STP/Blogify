// client/src/pages/Blog.jsx
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { getAllPosts } from "../services/postService"; // Import our API function



function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //states to add/delete post
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

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
  }, []); // The empty array ensures this runs only once on mount

  //handler function for form submission
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const newPost = await createPost({
        title: newTitle, content: newContent
      });
      setPosts([newPost, ...posts]);
      //clear the form fields
      setNewTitle('');
      setNewContent('');
    }
    catch (err) {
      setError(err.message);
    }
    
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Blog</h1>
      {/* Create New Post form */}
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid black",}}>
        <h2>Create New Post</h2>
        <form onSubmit={handleCreatePost}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Create Post</button>
        </form>
      </div>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}
        >
          <Link to={`/posts/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>Published on:{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

export default Blog;
