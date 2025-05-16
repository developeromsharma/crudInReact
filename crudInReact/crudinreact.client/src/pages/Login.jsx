import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // <-- Loading state
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);  // Start loading

        try {
            const response = await axios.post('https://localhost:7226/api/User/login', {
                username,
                password
            });

            const { token, isAdmin } = response.data;
            login(token, isAdmin);
            navigate('/courses');
        } catch (err) {
            console.error(err);
            alert('Login failed');
        } finally {
            setIsLoading(false); // Stop loading when done (success or error)
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                disabled={isLoading} // Disable inputs during loading
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {/* Show a simple progress bar or spinner */}
            {isLoading && (
                <div style={{ marginTop: '10px' }}>
                    <progress />
                    {/* Or use a spinner component or CSS animation */}
                </div>
            )}
        </form>
    );
};

export default Login;
