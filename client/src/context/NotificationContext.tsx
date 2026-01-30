import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface Notification {
    id: number;
    action: string;
    target: string;
    organizationId: number;
    createdAt: string;
    read?: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth();

    // Mock initial fetch or real API if valid
    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            // Using existing activities API as a source for notifications
            const token = localStorage.getItem('token');
            if (token) {
                const res = await axios.get('/api/activities?limit=10', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Transform activities to notifications, assuming they are unread for demo
                // In a real app we'd filter for 'read' status from DB
                const notifs = res.data.map((item: any) => ({ ...item, read: false }));
                setNotifications(notifs);
                setUnreadCount(notifs.length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const clearAll = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};
