import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Users, Briefcase, ChevronLeft, ChevronRight, BarChart3, Settings,
    LogOut, PieChart, UserCog, Sun, Moon, Bell, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import ChatWidget from './ChatWidget';

/**
 * Sidebar navigation item component.
 */
const SidebarItem = ({ to, icon: Icon, label, collapsed }: { to: string, icon: any, label: string, collapsed: boolean }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 group relative
                ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
            title={collapsed ? label : ''}
        >
            <Icon size={20} className={`min-w-[20px] transition-colors ${isActive ? 'text-white' : 'group-hover:text-slate-900 dark:group-hover:text-white'}`} />
            {!collapsed && <span className="font-medium whitespace-nowrap overflow-hidden transition-all">{label}</span>}


            {collapsed && (
                <div className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-700 pointer-events-none">
                    {label}
                </div>
            )}
        </Link>
    );
};

/**
 * Main Layout component containing Sidebar, Header, and Content Area.
 * Handles search functionality and responsive navigation.
 */
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

// ... (existing code)

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { unreadCount } = useNotifications(); // Use context

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any>({ accounts: [], deals: [], contacts: [] });
    const [showResults, setShowResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false); // New state
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                try {
                    const token = localStorage.getItem('token');
                    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                    const res = await axios.get(`/api/search?q=${searchQuery}`, config);
                    setSearchResults(res.data);
                    setShowResults(true);
                } catch (err) {
                    console.error('Search failed', err);
                }
            } else {
                setSearchResults({ accounts: [], deals: [], contacts: [] });
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
            <aside
                className={`${collapsed ? 'w-20' : 'w-72'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 relative flex flex-col shadow-xl z-20`}
            >
                <div className={`h-20 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-slate-200 dark:border-slate-800 transition-all bg-white dark:bg-slate-900`}>
                    <Link to="/" className="flex items-center cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                            <Briefcase className="text-white" size={20} />
                        </div>
                        {!collapsed && (
                            <div className="ml-3 overflow-hidden">
                                <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight whitespace-nowrap">Nexura</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Enterprise CRM</p>
                            </div>
                        )}
                    </Link>
                </div>

                <nav className="mt-6 flex-1 space-y-1.5 overflow-y-auto custom-scrollbar px-2">
                    <div className={`px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider ${collapsed ? 'hidden' : 'block'}`}>
                        Main Menu
                    </div>
                    <SidebarItem to="/" icon={BarChart3} label="Overview" collapsed={collapsed} />
                    <SidebarItem to="/deals" icon={Briefcase} label="Deals Pipeline" collapsed={collapsed} />
                    <SidebarItem to="/reports" icon={PieChart} label="Reports & Analytics" collapsed={collapsed} />

                    <div className={`mt-6 px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider ${collapsed ? 'hidden' : 'block'}`}>
                        Management
                    </div>
                    <SidebarItem to="/customers" icon={Users} label="Client Directory" collapsed={collapsed} />
                    {user?.role === 'admin' && (
                        <SidebarItem to="/teams" icon={UserCog} label="Team Structure" collapsed={collapsed} />
                    )}
                    <SidebarItem to="/careers" icon={Briefcase} label="Careers" collapsed={collapsed} />

                    <div className={`mt-6 px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider ${collapsed ? 'hidden' : 'block'}`}>
                        System
                    </div>
                    <SidebarItem to="/settings" icon={Settings} label="Global Settings" collapsed={collapsed} />
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <button
                        onClick={logout}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 w-full transition-all group ${collapsed ? 'justify-center' : ''}`}
                        title={collapsed ? 'Logout' : ''}
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {!collapsed && <span className="font-medium">Sign Out</span>}
                    </button>
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-24 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 dark:hover:text-white rounded-full p-1.5 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all hover:scale-110 z-50"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </aside>

            <main className="flex-1 overflow-hidden flex flex-col relative bg-slate-50 dark:bg-slate-950">

                <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 transition-colors duration-300 z-10">


                    <div className="flex items-center flex-1 max-w-xl z-50">
                        <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search clients, deals, or employees..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                            />

                            {showResults && (
                                <div className="absolute top-12 left-0 w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden max-h-96 overflow-y-auto z-50 animate-fade-in-up">
                                    {(searchResults.accounts.length === 0 && searchResults.deals.length === 0 && searchResults.contacts.length === 0) ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">No results found.</div>
                                    ) : (
                                        <>
                                            {searchResults.accounts.length > 0 && (
                                                <div className="p-2">
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase px-2 mb-1">Accounts</h4>
                                                    {searchResults.accounts.map((acc: any) => (
                                                        <Link to="/accounts" key={acc.id} onClick={() => setShowResults(false)} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg">
                                                            {acc.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            {searchResults.deals.length > 0 && (
                                                <div className="p-2 border-t border-gray-100 dark:border-slate-800">
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase px-2 mb-1">Deals</h4>
                                                    {searchResults.deals.map((deal: any) => (
                                                        <Link to="/deals" key={deal.id} onClick={() => setShowResults(false)} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg">
                                                            {deal.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            {searchResults.contacts.length > 0 && (
                                                <div className="p-2 border-t border-gray-100 dark:border-slate-800">
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase px-2 mb-1">Contacts</h4>
                                                    {searchResults.contacts.map((contact: any) => (
                                                        <Link to="/contacts" key={contact.id} onClick={() => setShowResults(false)} className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg">
                                                            {contact.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <button className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400">
                            <Search size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-6">

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors relative"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors relative"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                                )}
                            </button>
                            <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
                        </div>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight group-hover:text-blue-600 transition-colors">{user?.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">
                                        {user?.name.charAt(0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 relative scroll-smooth">
                    <div className="animate-fade-in-up max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
                <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 text-center text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center px-8 z-10 transition-colors duration-300">
                    <span>&copy; 2026 Nexura Inc. All rights reserved.</span>
                    <span className="font-mono">
                        {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true })}
                    </span>
                </footer>
            </main>
            <ChatWidget />
        </div >
    );
};

export default Layout;
