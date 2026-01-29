import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Briefcase, DollarSign, Building2 } from 'lucide-react';

interface AddDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

interface Account {
    id: number;
    name: string;
}

const AddDealModal = ({ isOpen, onClose, onSuccess, initialData }: AddDealModalProps) => {
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [stage, setStage] = useState('New');
    const [accountId, setAccountId] = useState('');
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchAccounts();
            if (initialData) {
                setTitle(initialData.title);
                setValue(initialData.value.toString());
                setStage(initialData.stage);
                setAccountId(initialData.accountId?.toString() || initialData.account?.id?.toString() || '');
            } else {
                resetForm();
            }
        }
    }, [isOpen, initialData]);

    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(res.data);
        } catch (error) {
            console.error('Failed to fetch accounts');
        }
    };

    const resetForm = () => {
        setTitle('');
        setValue('');
        setStage('New');
        setAccountId('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const dealData = {
                title,
                value: Number(value),
                stage,
                accountId: Number(accountId)
            };

            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (initialData) {
                await axios.put(`/api/deals/${initialData.id}`, dealData, config);
            } else {
                await axios.post('/api/deals', dealData, config);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save deal', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Deal' : 'Add New Deal'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Website Redesign"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value (₹)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="number"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                            >
                                <option value="">Select Account</option>
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={stage}
                            onChange={(e) => setStage(e.target.value)}
                        >
                            <option value="New">New</option>
                            <option value="Negotiation">Negotiation</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (initialData ? 'Update Deal' : 'Create Deal')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDealModal;
