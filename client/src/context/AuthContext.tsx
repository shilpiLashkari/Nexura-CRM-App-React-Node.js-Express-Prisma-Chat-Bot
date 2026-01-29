import { createContext, useContext } from 'react';

export type Role = 'admin' | 'user';

export interface User {
    name: string;
    role: Role;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    setRole: (role: Role) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const login = async (email: string, pass: string) => {
        // In a real app, this would hit the API. 
        // For now, let's assume the Login page handles the API call and just calls a 'setUser' here? 
        // Or actually, the context should handle the API call. 
        // Let's make it consistent with the interface. 
        // The interface says login(email, pass).

        try {
            const res = await axios.post('/api/auth/login', { email, password: pass });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const setRole = (role: Role) => {
        if (user) {
            const updatedUser = { ...user, role };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage too if we want persistence of role change from dev tools
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};
