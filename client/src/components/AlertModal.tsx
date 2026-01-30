import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { useEffect, useState } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type: AlertType;
    confirmText: string;
    onConfirm: () => void;
}

const AlertModal = ({ isOpen, onClose, title, message, type, confirmText, onConfirm }: AlertModalProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 300); // Wait for animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show && !isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={32} className="text-green-500" />;
            case 'error': return <AlertOctagon size={32} className="text-red-500" />;
            case 'warning': return <AlertTriangle size={32} className="text-amber-500" />;
            default: return <Info size={32} className="text-blue-500" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-100 text-green-800';
            case 'error': return 'bg-red-50 border-red-100 text-red-800';
            case 'warning': return 'bg-amber-50 border-amber-100 text-amber-800';
            default: return 'bg-blue-50 border-blue-100 text-blue-800';
        }
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'bg-black/40 backdrop-blur-sm opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'}`}>
            <div
                className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}
            >
                <div className="absolute top-4 right-4 z-10">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getColors()} animate-pulse-soft`}>
                        {getIcon()}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{message}</p>

                    <button
                        onClick={onConfirm}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all active:scale-95 ${type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' :
                                type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30' :
                                    type === 'warning' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/30' :
                                        'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
