import { useState, useEffect } from 'react';
import { Users, Briefcase, TrendingUp, Settings, X, BarChart3, ChevronRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Types
interface TeamMember {
    id: number;
    name: string;
    role: string;
    avatar: string;
    teamId: string;
}

interface Team {
    id: string;
    name: string;
    icon: any;
    manager: TeamMember;
    color: string;
    description: string;
}

// Initial Data
const INITIAL_TEAMS: Team[] = [
    {
        id: 'engineering',
        name: 'Engineering',
        icon: Settings,
        color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
        description: 'Product Development & Infrastructure',
        manager: { id: 1, name: 'Siddharth Menon', role: 'VP of Engineering', avatar: 'SM', teamId: 'engineering' },
    },
    {
        id: 'sales',
        name: 'Global Sales',
        icon: TrendingUp,
        color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
        description: 'Revenue & Client Acquisition',
        manager: { id: 2, name: 'Aditi Sharma', role: 'Chief Revenue Officer', avatar: 'AS', teamId: 'sales' },
    },
    {
        id: 'marketing',
        name: 'Marketing',
        icon: Briefcase,
        color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
        description: 'Brand & Growth Strategy',
        manager: { id: 3, name: 'Rohit Verma', role: 'CMO', avatar: 'RV', teamId: 'marketing' },
    },
    {
        id: 'hr',
        name: 'People & Culture',
        icon: Users,
        color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
        description: 'Talent Acquisition & Employee Success',
        manager: { id: 4, name: 'Priya Iyer', role: 'CHRO', avatar: 'PI', teamId: 'hr' },
    }
];

const INITIAL_MEMBERS: TeamMember[] = [
    { id: 101, name: 'Arjun Mehta', role: 'Senior Backend Engineer', avatar: 'AM', teamId: 'engineering' },
    { id: 102, name: 'Zara Khan', role: 'Frontend Lead', avatar: 'ZK', teamId: 'engineering' },
    { id: 103, name: 'Dev Patel', role: 'DevOps Engineer', avatar: 'DP', teamId: 'engineering' },
    { id: 201, name: 'Vikram Singh', role: 'Enterprise Account Executive', avatar: 'VS', teamId: 'sales' },
    { id: 202, name: 'Ananya Gupta', role: 'Sales Development Rep', avatar: 'AG', teamId: 'sales' },
    { id: 301, name: 'Karan Malhotra', role: 'Product Marketing Manager', avatar: 'KM', teamId: 'marketing' },
    { id: 302, name: 'Sneha Reddy', role: 'Content Strategist', avatar: 'SR', teamId: 'marketing' },
    { id: 401, name: 'Rahul Nair', role: 'HR Business Partner', avatar: 'RN', teamId: 'hr' }
];

const Teams = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>(() => {
        const saved = localStorage.getItem('teamMembers');
        return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    });

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPerfModalOpen, setIsPerfModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    // Form State
    const [newMember, setNewMember] = useState({ name: '', role: '', teamId: 'engineering' });

    useEffect(() => {
        localStorage.setItem('teamMembers', JSON.stringify(members));
    }, [members]);

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        const member: TeamMember = {
            id: Date.now(),
            name: newMember.name,
            role: newMember.role,
            avatar: newMember.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
            teamId: newMember.teamId
        };
        setMembers([...members, member]);
        setIsAddModalOpen(false);
        setNewMember({ name: '', role: '', teamId: 'engineering' });
    };

    const openPerfModal = (team: Team) => {
        setSelectedTeam(team);
        setIsPerfModalOpen(true);
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Organization Structure</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage functional teams, roles, and reporting lines.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 font-medium"
                >
                    <UserPlus size={18} />
                    Add Employee
                </button>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {INITIAL_TEAMS.map((team) => (
                    <div key={team.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all group">

                        {/* Team Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${team.color} shadow-sm`}>
                                        <team.icon size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">{team.name}</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{team.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Manager Card */}
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                    {team.manager.avatar}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Team Lead</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{team.manager.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500">{team.manager.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Members List */}
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3 px-2">
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                    Members ({members.filter(m => m.teamId === team.id).length})
                                </p>
                            </div>
                            <div className="space-y-1">
                                {members.filter(m => m.teamId === team.id).map((member) => (
                                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer group/member">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold group-hover/member:bg-blue-100 dark:group-hover/member:bg-blue-900 group-hover/member:text-blue-600 dark:group-hover/member:text-blue-300 transition-colors">
                                            {member.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/member:text-blue-600 dark:group-hover/member:text-blue-400 transition-colors">{member.name}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">{member.id} • {member.role}</p>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover/member:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
                            <button
                                onClick={() => openPerfModal(team)}
                                className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1 w-full"
                            >
                                <BarChart3 size={16} />
                                View Team Performance
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Member Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 m-4 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Employee</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Anjali Desai"
                                    value={newMember.name}
                                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title / Role</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Senior Analyst"
                                    value={newMember.role}
                                    onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign to Team</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newMember.teamId}
                                    onChange={e => setNewMember({ ...newMember, teamId: e.target.value })}
                                >
                                    {INITIAL_TEAMS.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2">
                                Add Employee
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Performance Modal */}
            {isPerfModalOpen && selectedTeam && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl p-6 m-4 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selectedTeam.name} Performance</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Q3 2025 Review Cycle</p>
                            </div>
                            <button onClick={() => setIsPerfModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Overall Rating</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">4.8<span className="text-sm text-slate-400">/5.0</span></p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Projects Completed</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">24</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Efficiency</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">+12%</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800 dark:text-white">OKR Progress</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700 dark:text-slate-300">Quarterly Goals</span>
                                        <span className="font-medium text-slate-900 dark:text-white">85%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700 dark:text-slate-300">Employee Satisfaction</span>
                                        <span className="font-medium text-slate-900 dark:text-white">92%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-700 dark:text-slate-300">Budget Utilization</span>
                                        <span className="font-medium text-slate-900 dark:text-white">78%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '78%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teams;
