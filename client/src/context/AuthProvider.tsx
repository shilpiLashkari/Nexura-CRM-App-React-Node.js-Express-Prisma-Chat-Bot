import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type User, type Role } from './AuthContext';
import axios from 'axios';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setUser(res.data.user);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));

            // Set default header for future requests if token exists? 
            // Better to just set it per request or use interceptor, but for now simple is ok.
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, pass: string) => {
        const res = await axios.post('/api/auth/login', { email, password: pass });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setUser(user);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        // localStorage.removeItem('user'); // No longer storing whole user object
    };

    const setRole = (role: Role) => {
        // Optimistic update only, real role is from DB
        if (user) {
            setUser({ ...user, role });
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            setRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};
