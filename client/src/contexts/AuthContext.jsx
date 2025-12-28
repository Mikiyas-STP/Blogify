// client/src/contexts/AuthContext.jsx (Upgraded Version)
import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 1. Initialize state by reading the token from localStorage
  const [token, setToken] = useState(localStorage.getItem('blogify_token'));

  // 2. Use an effect to update localStorage whenever the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('blogify_token', token);
    } else {
      localStorage.removeItem('blogify_token');
    }
  }, [token]);

  // We will create login/logout functions right here
  const login = async (email, password) => {
    try {
      const data = await loginService({ email, password });
      setToken(data.token);
    } catch (error) {
      // Re-throw the error so the component can handle it
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
  };

  // The value now includes the token and the functions
  const value = { token, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}