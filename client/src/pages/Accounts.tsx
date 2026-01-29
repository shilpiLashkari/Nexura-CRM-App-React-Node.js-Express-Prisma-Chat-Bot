import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Building2, Globe, MapPin, MoreHorizontal } from 'lucide-react';

interface Account {
    id: number;
    name: string;
    industry?: string;
    website?: string;
    address?: string;
}

const Accounts = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [website, setWebsite] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(res.data);
        } catch (error) {
            console.error('Failed to fetch accounts', error);
        }
    };

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/accounts',
                { name, industry, website, address },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsAddModalOpen(false);
            setName('');
            setIndustry('');
            setWebsite('');
            setAddress('');
            fetchAccounts();
        } catch (error) {
            console.error('Failed to create account', error);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                const accounts = lines.slice(1).filter(line => line.trim()).map(line => {
                    const values = line.split(',');
                    const account: any = {};
                    headers.forEach((header, index) => {
                        if (values[index]) account[header] = values[index].trim();
                    });
                    return account;
                });

                if (accounts.length === 0) {
                    alert('No valid accounts found in CSV');
                    return;
                }

                const token = localStorage.getItem('token');
                await axios.post('/api/accounts/import',
                    { accounts },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                alert(`Successfully imported ${accounts.length} accounts`);
                fetchAccounts();
            } catch (error) {
                console.error('Import failed', error);
                alert('Failed to import accounts');
            }
            // Reset input
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Accounts</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your client organizations</p>
                </div>
                <div className="flex gap-4">
                    <label className="cursor-pointer bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transform transition-all active:scale-95 shadow-sm">
                        <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
                        Import CSV
                    </label>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transform transition-all active:scale-95 shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
                    >
                        <Plus size={20} />
                        Add Account
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-gray-50/50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Industry</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Website</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {filteredAccounts.map((account) => (
                            <tr key={account.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => {/* Navigate to details if needed */ }}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{account.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">ID: {account.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                                        {account.industry || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {account.website ? (
                                        <a href={account.website.startsWith('http') ? account.website : `https://${account.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                                            <Globe size={14} />
                                            {account.website}
                                        </a>
                                    ) : <span className="text-gray-400 dark:text-gray-500">-</span>}
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {account.address || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredAccounts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    No accounts found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Account Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Account</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">×</button>
                        </div>
                        <form onSubmit={handleAddAccount} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    placeholder="e.g. Technology"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="e.g. www.acme.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="e.g. 123 Main St"
                                    rows={3}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;
