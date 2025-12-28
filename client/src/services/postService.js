const API_URL = 'http://localhost:5001/api/posts';

//helper function to get auth headers : if token exist it adds authorization header
const getAuthHeaders = () => {
  const token = localStorage.getItem('blogify_token');
  const headers = {
    'Content-Type' : 'application/json',
  };
  if(token){
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

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
    headers: getAuthHeaders(), // Use our helper function
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error('Failed to create post. Are you logged in?');
  }
  return await response.json();
};

export const updatePost = async (postId, postData) => {
  const response = await fetch(`${API_URL}/${postId}`, {
    method: 'PUT',
    headers: getAuthHeaders(), // Use our helper function
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error('Failed to update post. Are you logged in?');
  }
  return await response.json();
};

export const deletePost = async (postId) => {
  const response = await fetch(`${API_OURL}/${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(), // Use our helper function
  });
  if (!response.ok) {
    throw new Error('Failed to delete post. Are you logged in?');
  }
  return await response.json();
};