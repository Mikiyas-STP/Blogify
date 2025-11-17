//The base URL of our Express API
//we define this functions instead of defining the fetch inside the components to avoid editing many components incase our API URL Changed.
const API_URL = "http://localhost:5001/api/posts";
// This function will fetch all posts from our API
export const getAllPosts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch posts.");
  }
  return await response.json();
};

export const getPostById = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post.');
  }
  return await response.json();
};



// Function to create a new post
export const createPost = async (postData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData), //e.g. { title: 'New', content: 'Post' }
  });
  if (!response.ok) {
    throw new Error('Failed to create post.');
  }
  return await response.json();
};

// Function to delete a post
export const deletePost = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete post.');
  }
  return await response.json(); // Our server sends back a success message
};