import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../contexts/AuthContext';


// client/src/components/Navbar.jsx

// ... imports

function Navbar() {
  const { token, logout } = useAuth(); // Get the values

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>Blogify</Link>
      <ul className={styles.navLinks}>
        {token ? (
          // If user IS logged in
          <li>
            <button onClick={logout} className={styles.logoutButton}>Logout</button>
          </li>
        ) : (
          // If user IS NOT logged in (use a React Fragment <> to group them)
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;