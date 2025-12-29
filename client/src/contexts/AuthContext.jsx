// client/src/contexts/AuthContext.jsx (Upgraded)
import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import the new library
import { login as loginService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // This will now store the user object { id, username }
  const [token, setToken] = useState(localStorage.getItem('blogify_token'));

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('blogify_token', token);
        const decodedUser = jwtDecode(token); // Decode the token
        setUser(decodedUser.user); // Set the user state
      } else {
        localStorage.removeItem('blogify_token');
        setUser(null); // Clear the user state
      }
    } catch (error) {
      // If token is invalid or expired, clear it
      console.error("Invalid token:", error);
      localStorage.removeItem('blogify_token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await loginService({ email, password });
      setToken(data.token); // Setting the token will trigger the useEffect above
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null); // Setting token to null will also trigger the useEffect
  };

  const value = { token, user, login, logout }; // Add 'user' to the context value

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}