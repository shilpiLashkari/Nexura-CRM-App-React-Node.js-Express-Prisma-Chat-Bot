import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import AddDealModal from '../components/AddDealModal';

interface Deal {
    id: number;
    title: string;
    value: number;
    stage: string;
    account?: {
        id: number;
        name: string;
    };
    accountId: number;
    createdAt: string;
}

const STAGES = ['New', 'Negotiation', 'Won', 'Lost'];

// Sortable Item Component
const SortableDealItem = ({ deal, onClick }: { deal: Deal, onClick: () => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: deal.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-600 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{deal.title}</h4>
                <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(deal.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{deal.account?.name || 'No Account'}</p>
            <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">₹{deal.value.toLocaleString('en-IN')}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${deal.stage === 'Won' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    deal.stage === 'Lost' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                    {deal.stage}
                </span>
            </div>
        </div>
    );
};

const Deals = () => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/deals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeals(response.data);
        } catch (error) {
            console.error('Error fetching deals:', error);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        // Find the dropped deal
        const dealId = active.id as number;
        const deal = deals.find(d => d.id === dealId);

        if (!deal) return;

        // Check if dropped on a container (stage) or another item
        let newStage = over.id as string;

        // If dropped over another item, find that item's stage
        if (typeof over.id === 'number') {
            const overDeal = deals.find(d => d.id === over.id);
            if (overDeal) newStage = overDeal.stage;
        }

        // Validate stage
        if (!STAGES.includes(newStage)) return;

        // Optimistic update
        if (deal.stage !== newStage) {
            const updatedDeals = deals.map(d =>
                d.id === dealId ? { ...d, stage: newStage } : d
            );
            setDeals(updatedDeals);

            // API Call
            try {
                const token = localStorage.getItem('token');
                await axios.put(`/api/deals/${dealId}`,
                    { ...deal, stage: newStage, accountId: deal.accountId }, // Need to send all required fields or partial? Controller expects full body usually or we check.
                    // My controller expects title, value, stage, accountId.
                    // So I need to ensure I send them all.
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error('Failed to update deal stage');
                fetchDeals(); // Revert
            }
        }
    };

    const handleEdit = (deal: Deal) => {
        setEditingDeal(deal);
        setIsModalOpen(true);
    };

    const handleOpenModal = () => {
        setEditingDeal(null);
        setIsModalOpen(true);
    };

    const filteredDeals = deals.filter(deal =>
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.account?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Deals Pipeline</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your opportunities</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search deals..."
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
                    >
                        <Plus size={20} />
                        New Deal
                    </button>
                </div>
            </div>

            <AddDealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchDeals}
                initialData={editingDeal}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 h-full overflow-hidden min-h-0">
                    {STAGES.map(stage => {
                        const stageDeals = filteredDeals.filter(d => d.stage === stage);
                        const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

                        return (
                            <div key={stage} className="flex flex-col h-full bg-gray-50/50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden min-h-0">
                                <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-gray-700 dark:text-white truncate">{stage}</h3>
                                        <span className="text-xs bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full flex-shrink-0">{stageDeals.length}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">₹{stageTotal.toLocaleString('en-IN')}</p>
                                </div>

                                <SortableContext
                                    id={stage}
                                    items={stageDeals.map(d => d.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3 min-h-0" id={stage}>
                                        {stageDeals.map(deal => (
                                            <SortableDealItem key={deal.id} deal={deal} onClick={() => handleEdit(deal)} />
                                        ))}
                                        {stageDeals.length === 0 && (
                                            <div className="h-24 border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                                                Drop here
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </div>
                        );
                    })}
                </div>
            </DndContext>
        </div>
    );
};

export default Deals;
