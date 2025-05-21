import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null); 

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setIsAdmin(payload.isAdmin === "True" || payload.isAdmin === true);
                setUser({
                    userName: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                    userId: payload.userId,
                });
            } catch (err) {
                console.error("Invalid token", err);
                setIsAdmin(false);
                setUser(null);
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
        setUser(null); 
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isAdmin, user, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};
