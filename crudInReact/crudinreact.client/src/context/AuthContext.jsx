import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setIsAdmin(payload.isAdmin === "True" || payload.isAdmin === true);
            } catch (err) {
                console.error("Invalid token", err);
                setIsAdmin(false);
            }
        }
    }, [token]);

    const login = (token) => {
        sessionStorage.setItem('token', token);
        setToken(token);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setToken(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAdmin, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};
