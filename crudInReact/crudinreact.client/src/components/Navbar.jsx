import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            {/* Centered Course Management */}
            <h2 style={{ margin: 0 }}>Course Management</h2>

            {/* Logout or Login button */}
            <div>
                {isAuthenticated ? (
                    <button onClick={logout} style={{ float: 'right' }}>Logout</button>
                ) : (
                    <Link to="/login" style={{ float: 'right' }}>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
