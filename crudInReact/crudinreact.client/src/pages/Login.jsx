import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('https://localhost:7226/api/User/login', {
                username,
                password
            });

            const { token, isAdmin } = response.data;
            login(token, isAdmin);
            navigate(isAdmin ? '/admin' : '/dashboard');
        } catch (err) {
            alert('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="d-flex flex-column align-items-center gap-3 mt-5">
            <h2>Login</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                disabled={isLoading}
                className="form-control"
                style={{ maxWidth: '300px' }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={isLoading}
                className="form-control"
                style={{ maxWidth: '300px' }}
            />
            <button type="submit" disabled={isLoading} className="btn btn-primary">
                {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {isLoading && (
                <div style={{ marginTop: '10px' }}>
                    <progress />
                </div>
            )}
        </form>
    );
};

export default Login;
