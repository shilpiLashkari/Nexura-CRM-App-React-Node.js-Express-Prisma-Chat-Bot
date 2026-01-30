import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import AlertModal from '../components/AlertModal';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertOptions {
    title?: string;
    confirmText?: string;
    onConfirm?: () => void;
}

interface AlertContextType {
    showAlert: (message: string, type?: AlertType, options?: AlertOptions) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<AlertType>('info');
    const [title, setTitle] = useState('');
    const [confirmText, setConfirmText] = useState('OK');
    const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(undefined);

    const showAlert = useCallback((msg: string, alertType: AlertType = 'info', options?: AlertOptions) => {
        setMessage(msg);
        setType(alertType);
        setTitle(options?.title || (alertType.charAt(0).toUpperCase() + alertType.slice(1)));
        setConfirmText(options?.confirmText || 'OK');
        setOnConfirm(() => options?.onConfirm);
        setIsOpen(true);
    }, []);

    const hideAlert = useCallback(() => {
        setIsOpen(false);
        // Reset state after transition
        setTimeout(() => {
            setMessage('');
            setTitle('');
            setOnConfirm(undefined);
        }, 300);
    }, []);

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        hideAlert();
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <AlertModal
                isOpen={isOpen}
                onClose={hideAlert}
                title={title}
                message={message}
                type={type}
                confirmText={confirmText}
                onConfirm={handleConfirm}
            />
        </AlertContext.Provider>
    );
};
