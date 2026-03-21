import { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
    Users, 
    ShieldCheck, 
    AlertTriangle,
    CheckCircle2,
    ClipboardCheck
} from 'lucide-react';

const TeacherHome = () => {
    const [stats, setStats] = useState({ total: 0, cleared: 0, pending: 0, due: 0 });
    const [dutyName, setDutyName] = useState('');
    const [allDuties, setAllDuties] = useState([]);
    const [loading, setLoading] = useState(true);
    const { selectedDuty, updateSelectedDuty } = useAuth();

    useEffect(() => {
        fetchStats(selectedDuty);
    }, [selectedDuty]);

    const fetchStats = async (dutyId = null) => {
        try {
            const url = dutyId ? `/teacher/students?duty_id=${dutyId}` : '/teacher/students';
            const { data } = await API.get(url);
            const students = data.students || [];
            setDutyName(data.dutyName || 'Unassigned');
            setAllDuties(data.allDuties || []);
            
            // Set first duty as selected if none exists
            if (!selectedDuty && data.dutyId) {
                updateSelectedDuty(data.dutyId);
            }

            setStats({
                total: students.length,
                cleared: students.filter(s => s.status === 'cleared').length,
                pending: students.filter(s => s.status === 'pending').length,
                due: students.filter(s => s.status === 'due').length
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-400">Loading dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Faculty Overview</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Managing clearance for <span className="text-blue-400 font-semibold">{dutyName}</span>
                            </p>
                        </div>
                    </div>

                    {allDuties.length > 1 && (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Switch Duty</label>
                            <select 
                                value={selectedDuty || ''}
                                onChange={(e) => updateSelectedDuty(e.target.value)}
                                className="bg-slate-950 border border-slate-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors cursor-pointer min-w-[200px]"
                            >
                                {allDuties.map(d => (
                                    <option key={d.duty_id} value={d.duty_id}>{d.duty_name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {!dutyName && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 text-red-500 text-sm font-medium">
                        <AlertTriangle size={20} />
                        <p>No duty assigned by administrative panel.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-slate-800 text-blue-500">
                                <Users size={24} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-400">Total Students</p>
                        <p className="text-3xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-slate-800 text-emerald-500">
                                <CheckCircle2 size={24} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-400">Cleared</p>
                        <p className="text-3xl font-bold text-white">{stats.cleared}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-slate-800 text-amber-500">
                                <ClipboardCheck size={24} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-400">Pending</p>
                        <p className="text-3xl font-bold text-white">{stats.pending}</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-slate-800 text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-400">Dues Found</p>
                        <p className="text-3xl font-bold text-white">{stats.due}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherHome;
