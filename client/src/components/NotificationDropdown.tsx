import { Bell, Trash2, Clock } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useRef, useEffect } from 'react';

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800 z-50 animate-slide-in-right origin-top-right overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <Bell size={16} className="text-blue-600" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-bold">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                        <Trash2 size={12} /> Clear all
                    </button>
                )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                        <Bell size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No new notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors relative group ${!item.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                onClick={() => markAsRead(item.id)}
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.action.includes('created') ? 'bg-green-100 text-green-600' :
                                        item.action.includes('deleted') ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        <Bell size={14} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                            <span className="font-semibold">{item.action}</span>: {item.target}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock size={12} className="text-gray-400" />
                                            <span className="text-xs text-gray-400">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    {!item.read && (
                                        <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-center">
                <button onClick={onClose} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Close Panel
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
