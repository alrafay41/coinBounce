import styles from '../navbar/Navbar.module.css'
import { NavLink } from 'react-router-dom';
function Navbar() {

    const isAuthenticated = false

    return (
        <div>
            <nav className={styles.navbar}>
                <NavLink className={`${styles.logo}, ${styles.inActiveStyle}`} to='/'>CoinBounce</NavLink>
                <NavLink className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle} to='/'>Home</NavLink>
                <NavLink className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle} to='/crypto'>CryptoCurrencies</NavLink>
                <NavLink className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle} to='blogs'>Blogs</NavLink>
                <NavLink className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle} to='submit'>Submit a Blog</NavLink>
                {
                    isAuthenticated ? (<div className={styles.signOutButton}>Sign Out</div>) : (
                        <div>
                            <NavLink className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle} to='log-in'>
                                <button className={styles.logInButton}>Log In</button>
                            </NavLink>
                            <NavLink className={({ isActive }) => isActive ? styles.activeStyle : styles.inActiveStyle} to='sign-up'>
                                <button className={styles.signUpButton}>Sign Up</button>
                            </NavLink>
                        </div>
                    )


                }
            </nav>
            <div className={styles.separator}></div>
        </div>

    )
}

export default Navbar;