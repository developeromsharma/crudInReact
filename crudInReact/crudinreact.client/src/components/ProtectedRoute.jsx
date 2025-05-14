// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Assuming AuthContext is where token is stored

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { token, isAdmin } = useContext(AuthContext); // Assuming AuthContext has token and isAdmin

    if (!token) {
        // If no token, redirect to login
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin) {
        // If adminOnly route and user is not admin, redirect to home or a different page
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
