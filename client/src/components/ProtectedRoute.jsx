import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { token, user } = useAuth();
  if (!token) {
    // If the user is not logged in, redirect them to the login page.
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;