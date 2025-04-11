// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            
            if (token && userData) {
                try {
                    // Check if userData is not "undefined" or empty before parsing
                    if (userData !== "undefined" && userData !== null) {
                        setUserState(JSON.parse(userData));
                    } else {
                        setUserState(null); // Ensure we set userState to null if data is invalid
                    }
                } catch (error) {
                    console.error('Auth initialization error', error);
                    setUserState(null); // Ensure we set userState to null if there's a parsing error
                    logout();
                }
            } else {
                setUserState(null); // Ensure we set userState to null if token or userData is missing
            }
            setLoading(false);
        };
        
        initializeAuth();
    }, []);

    // 🔁 Custom setter that updates both state and localStorage
    const setUser = (userData) => {
        setUserState(userData);
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
        }
    };

    const login = async (credentials) => {
        const response = await authService.loginUser(credentials);
        setUser(response.user);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserState(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
