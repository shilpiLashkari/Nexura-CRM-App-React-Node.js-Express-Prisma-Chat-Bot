import { Navigate, Outlet } from 'react-router-dom';
// Wrapper for protected routes
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
