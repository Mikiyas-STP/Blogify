import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth(); //Get the 'user' object instead of 'token'

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>Blogify</Link>
      <ul className={styles.navLinks}>
        {user ? (
          // If user IS logged in
          <>
            <li className={styles.welcomeMessage}>Welcome, {user.username}!</li>
            <li>
              <button onClick={logout} className={styles.navButton}>Logout</button>
            </li>
          </>
        ) : (
          // If user IS NOT logged in
          <>
            <li><Link to="/login" className={styles.navLink}>Login</Link></li>
            <li><Link to="/register" className={styles.navLink}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;