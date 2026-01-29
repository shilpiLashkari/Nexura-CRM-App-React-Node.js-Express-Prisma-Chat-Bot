import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Briefcase, User as UserIcon } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegistering) {
                await axios.post('/api/auth/register', {
                    name,
                    email,
                    password,
                    organizationName
                });
                // Auto login after register? Or just switch to login?
                // For better UX, let's login immediately using the same credentials or the token returned.
                // The register endpoint returns { token, user }.
                // But our AuthContext 'login' function assumes making the request itself.
                // Let's just call login() after register success for simplicity, or just switch to login mode.
                // Actually, register endpoint returns token, so we can mock the login success?
                // To keep it clean, let's just use login() after register.
                await login(email, password);
            } else {
                await login(email, password);
            }
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="p-8 pb-0 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{isRegistering ? 'Start your 14-day free trial' : 'Sign in to access your CRM'}</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-800 flex items-center gap-2">
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isRegistering && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Name</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input type="text" required className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acme Corp" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input type="text" required className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 dark:shadow-blue-900/20 active:scale-95"
                        >
                            {isRegistering ? 'Get Started' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                        >
                            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Create Organization'}
                        </button>
                    </div>

                    {!isRegistering && (
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-4">Demo Credentials</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors" onClick={() => { setEmail('admin@crm.com'); setPassword('admin123'); }}>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">admin@crm.com</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">pass: admin123</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors" onClick={() => { setEmail('user@crm.com'); setPassword('user123'); }}>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">user@crm.com</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">pass: user123</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
