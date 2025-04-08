// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            if (token && userData) {
                try {
                    // Verify token is still valid
                    // You might want to add an API endpoint to validate tokens
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Auth initialization error', error);
                    logout();
                }
            }
            setLoading(false);
        };
        
        initializeAuth();
    }, []);

    const login = async (credentials) => {
        const response = await authService.loginUser(credentials);
        setUser(response.user);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 