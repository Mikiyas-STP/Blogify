// client/src/services/authService.js

// The base URL for our authentication endpoints
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth`;

// Function to handle user registration
export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData), // { username, email, password }
  });

  if (!response.ok) {
    // Try to get the error message from the server's JSON response
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to register.');
  }
  return await response.json();
};

// Function to handle user login
export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials), // { email, password }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to log in.');
  }
  // A successful login returns the JWT token
  return await response.json();
};