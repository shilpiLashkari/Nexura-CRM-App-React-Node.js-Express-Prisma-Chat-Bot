import { Settings as SettingsIcon, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, setRole } = useAuth();

    if (!user) return null;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Section - Available to All */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <UserIcon size={20} className="text-blue-600 dark:text-blue-400" />
                            Profile Settings
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your personal information</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl ring-2 ring-white dark:ring-slate-800">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300'}`}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed" value={user.name} disabled />
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">Profile editing available in next update.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Role Management - Admin Only */}
                {user.role === 'admin' && (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-md">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Shield size={20} className="text-purple-600 dark:text-purple-400" />
                                User Management
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Control user roles and permissions</p>
                        </div>

                        <div className="p-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">Testing Mode Active</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400/80">
                                    As an admin, you can switch your own role here to test the "User" perspective.
                                </p>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Switch My Role (For Testing)</label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRole('user')}
                                    className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${(user.role as string) === 'user'
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    User View
                                </button>
                                <button
                                    onClick={() => setRole('admin')}
                                    className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${(user.role as string) === 'admin'
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    Admin View
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                <SettingsIcon size={24} className="text-gray-400 dark:text-slate-600 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Global application settings coming soon...</p>
            </div>
        </div>
    );
};

export default Settings;
