import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        Blogify
      </Link>
    </nav>
  );
}

export default Navbar;