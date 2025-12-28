// client/src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. Import the 'login' function from our auth service
import { login as loginService } from '../services/authService.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  // 2. useNavigate is now correctly imported and can be used
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // 3. Call the imported service function
      const data = await loginService({ email, password });
      
      // We will handle the token from 'data' in our next lesson (Issue #7)
      console.log('Login successful, token:', data.token);

      // 4. Redirect to the homepage on success
      navigate('/');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Login to your Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;