const API_URL = 'http://localhost:5001/api/posts';

export const getAllPosts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) { throw new Error('Failed to fetch posts.'); }
  return await response.json();
};

export const getPostById = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}`);
  if (!response.ok) { throw new Error('Failed to fetch post.'); }
  return await response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!response.ok) { throw new Error('Failed to create post.'); }
  return await response.json();
};

export const updatePost = async (postId, postData) => {
  const response = await fetch(`${API_URL}/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!response.ok) { throw new Error('Failed to update post.'); }
  return await response.json();
};

export const deletePost = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}`, { method: 'DELETE' });
  if (!response.ok) { throw new Error('Failed to delete post.'); }
  return await response.json();
};