import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
    };

    const register = async (userData) => {
        const { data } = await API.post('/auth/register', userData);
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
    };

    const [selectedDuty, setSelectedDuty] = useState(() => {
        return localStorage.getItem('selectedDuty') || null;
    });

    const updateSelectedDuty = (dutyId) => {
        setSelectedDuty(dutyId);
        if (dutyId) {
            localStorage.setItem('selectedDuty', dutyId);
        } else {
            localStorage.removeItem('selectedDuty');
        }
    };

    const logout = () => {
        setUser(null);
        setSelectedDuty(null);
        localStorage.removeItem('user');
        localStorage.removeItem('selectedDuty');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, selectedDuty, updateSelectedDuty }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
