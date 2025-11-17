// client/src/pages/Blog.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../services/postService";

function Post() {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    
    useEffect(() => {
        const fetchPost = async () => {
      try {
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
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    if (!post) return <div>Post not found.</div>
    return (
    <div>
            <h1>{post.title}</h1>
            <p><em>Published on: {new Date(post.created_at).toLocaleDateString()}</em></p>
            {/*the content of the post */}
            <div style={{ marginTop: '2rem' }}>
                <p>{post.content}</p>

            </div>
    </div>
  );
}

export default Post;
