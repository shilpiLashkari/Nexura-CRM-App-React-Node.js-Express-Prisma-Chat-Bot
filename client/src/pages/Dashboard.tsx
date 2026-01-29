import { useEffect, useState } from 'react';
import { Users, Briefcase, IndianRupee, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import PlansModal from '../components/PlansModal';

interface Activity {
    id: number;
    action: string;
    target: string;
    createdAt: string;
}

interface DashboardStats {
    accounts: { value: number, trend: string, positive: boolean };
    deals: { value: number, trend: string, positive: boolean };
    revenue: { value: number, trend: string, positive: boolean };
    charts?: {
        dealsByStage: { name: string, value: number }[];
        revenueForecast: { name: string, value: number }[];
    };
}

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        accounts: { value: 0, trend: '+0%', positive: true },
        deals: { value: 0, trend: '+0%', positive: true },
        revenue: { value: 0, trend: '+0%', positive: true }
    });
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

    // Mock data for chart (currently unused, reserved for future use)
    const _mockChartData = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 2000 },
        { name: 'Apr', revenue: 2780 },
        { name: 'May', revenue: 1890 },
        { name: 'Jun', revenue: 2390 },
        { name: 'Jul', revenue: 3490 },
    ];
    void _mockChartData; // Suppress unused warning

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ensure auth header is present if needed, though axios global might handle it if set elsewhere
                // But Login.tsx didn't set axios defaults, AuthProvider sets token in localStorage.
                // We should probably use an interceptor or passed headers.
                // For now, let's just make sure we are not failing on 401.
                // The 'useAuth' hook doesn't set global axios headers.
                // We should assume headers are needed.
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [statsRes, activityRes] = await Promise.all([
                    axios.get('/api/stats', config),
                    axios.get('/api/activities?limit=4', config)
                ]);
                setStats(statsRes.data);
                setRecentActivity(activityRes.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Accounts',
            value: stats.accounts.value,
            trend: stats.accounts.trend,
            positive: stats.accounts.positive,
            icon: Users,
            color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        },
        {
            title: 'Active Deals',
            value: stats.deals.value,
            trend: stats.deals.trend,
            positive: stats.deals.positive,
            icon: Briefcase,
            color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
        },
        {
            title: 'Revenue',
            value: `₹${stats.revenue.value.toLocaleString('en-IN')}`,
            trend: stats.revenue.trend,
            positive: stats.revenue.positive,
            icon: IndianRupee,
            color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
        }
    ];

    const getActivityIcon = (action: string) => {
        if (action.includes('customer')) return <Users size={16} />;
        if (action.includes('deal')) return <Briefcase size={16} />;
        return <CheckCircle2 size={16} />;
    };

    const getActivityColor = (action: string) => {
        if (action.includes('customer')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
        if (action.includes('deal')) return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <PlansModal isOpen={isPlansModalOpen} onClose={() => setIsPlansModalOpen(false)} />

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color} flex-shrink-0`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className={`flex items-center text-sm font-medium ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                {stat.trend}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500 text-sm">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Pipeline */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Deals by Stage</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.charts?.dealsByStage || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        borderColor: '#374151',
                                        color: '#F3F4F6',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ color: '#818CF8' }}
                                    labelStyle={{ color: '#9CA3AF', marginBottom: '0.25rem' }}
                                />
                                <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Forecast */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Forecast</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.charts?.revenueForecast || []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        borderColor: '#374151',
                                        color: '#F3F4F6',
                                        borderRadius: '0.5rem',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ color: '#10B981' }}
                                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                                    labelStyle={{ color: '#9CA3AF', marginBottom: '0.25rem' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                    <Link to="/activities" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300">View All</Link>
                </div>
                <div className="space-y-6 flex-1 overflow-auto max-h-[300px] pr-2 custom-scrollbar">
                    {recentActivity.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">No recent activity.</p>
                    ) : (
                        recentActivity.map((item) => (
                            <div key={item.id} className="flex items-start gap-4">
                                <div className={`p-2 rounded-full mt-1 ${getActivityColor(item.action)}`}>
                                    {getActivityIcon(item.action)}
                                </div>
                                <div>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        System <span className="text-gray-500 dark:text-gray-400 font-normal">{item.action.toLowerCase()}</span>
                                    </p>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">{item.target}</p>
                                    <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-xs mt-1">
                                        <Clock size={12} />
                                        {new Date(item.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={() => setIsPlansModalOpen(true)}
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                    Upgrade Plan
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
