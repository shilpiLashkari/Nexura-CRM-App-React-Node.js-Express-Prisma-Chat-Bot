import { useState } from 'react';
import axios from 'axios';
import { FileDown, FileText, Calendar } from 'lucide-react';
import { useAlert } from '../context/AlertContext';

const Reports = () => {
    const [reportType, setReportType] = useState('deals');
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    const generateReport = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = reportType === 'deals' ? '/api/deals' : '/api/activities';

            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = response.data;
            if (!data || data.length === 0) {
                showAlert('No data available to export for this selection.', 'info');
                return;
            }

            // Convert to CSV
            const headers = Object.keys(data[0]).join(',');
            const rows = data.map((row: any) => Object.values(row).map(v =>
                typeof v === 'object' ? JSON.stringify(v) : `"${v}"`
            ).join(','));
            const csv = [headers, ...rows].join('\n');

            // Download
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showAlert('Report generated successfully! Download has started.', 'success');

        } catch (error) {
            console.error('Export failed', error);
            showAlert('Failed to generate report. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reports Center</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Generate and export insights about your business</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    onClick={() => setReportType('deals')}
                    className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 transform hover:-translate-y-1 ${reportType === 'deals'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'border-gray-100 bg-white dark:bg-slate-800 dark:border-slate-700 hover:shadow-md'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${reportType === 'deals' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                        <FileText size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Deals Report</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Export all deal data including stages, values, and AI scores.</p>
                </div>

                <div
                    onClick={() => setReportType('activities')}
                    className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 transform hover:-translate-y-1 ${reportType === 'activities'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500 shadow-lg shadow-purple-500/10'
                        : 'border-gray-100 bg-white dark:bg-slate-800 dark:border-slate-700 hover:shadow-md'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${reportType === 'activities' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                        <Calendar size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Activity Log</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Audit log of all system activities and user actions.</p>
                </div>
            </div>

            <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Export Settings</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Selected: <span className="capitalize font-medium text-blue-600 dark:text-blue-400">{reportType}</span></p>
                    </div>
                    <button
                        onClick={generateReport}
                        disabled={loading}
                        className="w-full sm:w-auto bg-gray-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-gray-900/10 dark:shadow-blue-900/20 active:scale-95"
                    >
                        {loading ? 'Generating...' : <><FileDown size={20} /> Download CSV</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
