// client/src/contexts/AuthContext.jsx
import { createContext, useState, useContext } from 'react';
// 1. Create the context
const AuthContext = createContext(null);
// 2. Create the Provider component
export function AuthProvider({ children }) {
  // 3. State to hold the auth token
  const [token, setToken] = useState(null);
  // The value that will be available to all children
  const value = { token, setToken };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
// 3. Create a custom hook to easily use the context
export function useAuth() {
  return useContext(AuthContext);
}