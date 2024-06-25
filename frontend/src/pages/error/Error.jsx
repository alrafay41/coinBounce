import styles from '../error/Error.module.css'
import { Link } from 'react-router-dom';

function Error() {
    return (
        <div className={styles.errorWrapper}>
            <div className={styles.errorHeader}>Error 404 - page not found</div>
            <div className={styles.errorBody}>
                go back to <Link to='/' className={styles.homeLink}>Home</Link>
            </div>
        </div>
    )
}

export default Error;