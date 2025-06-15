import { NavLink } from 'react-router-dom';
import styles from '../Header.module.css';

// component to display the header with navigation links
function Header({ title }) {
    return (
        <>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <nav className={styles.nav}>
                    <NavLink to="/" className={({ isActive }) => isActive ? styles.active : styles.inactive}>Home</NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? styles.active : styles.inactive}>About</NavLink>
                </nav>
            </div>
        </>
    );
}

export default Header;
