import { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, Users, CheckCircle2, Clock } from 'lucide-react';

interface Activity {
    id: number;
    action: string;
    target: string;
    createdAt: string;
}

const Activities = () => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/activities');
                setActivities(response.data);
            } catch (error) {
                console.error('Failed to fetch activities');
            }
        };
        fetchActivities();
    }, []);

    const getActivityIcon = (action: string) => {
        if (action.includes('customer')) return <Users size={16} />;
        if (action.includes('deal')) return <Briefcase size={16} />;
        return <CheckCircle2 size={16} />;
    };

    const getActivityColor = (action: string) => {
        if (action.includes('customer')) return 'bg-blue-100 text-blue-600';
        if (action.includes('deal')) return 'bg-indigo-100 text-indigo-600';
        return 'bg-green-100 text-green-600';
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-6">
                    {activities.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No activities found.</p>
                    ) : (
                        activities.map((item) => (
                            <div key={item.id} className="flex items-start gap-4">
                                <div className={`p-2 rounded-full mt-1 ${getActivityColor(item.action)}`}>
                                    {getActivityIcon(item.action)}
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium">
                                        System <span className="text-gray-500 font-normal">{item.action.toLowerCase()}</span>
                                    </p>
                                    <p className="text-blue-600 font-medium text-sm">{item.target}</p>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                        <Clock size={12} />
                                        {new Date(item.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Activities;
