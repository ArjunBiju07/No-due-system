import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
    Users, 
    BookOpen, 
    ShieldCheck, 
    LayoutGrid, 
    Settings
} from 'lucide-react';

const AdminOverview = () => {
    const [stats, setStats] = useState({ students: 0, teachers: 0, tutors: 0, departments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get('/admin/stats');
            setStats(res.data || { students: 0, teachers: 0, tutors: 0, departments: 0 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-slate-800 ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-slate-400">{label}</p>
                <p className="text-3xl font-bold text-white">{value || 0}</p>
            </div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-400">Loading statistics...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Settings size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
                        <p className="text-slate-400 text-sm mt-1">System-wide statistics and oversight</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Users} label="Total Students" value={stats.students} color="text-blue-500" />
                    <StatCard icon={ShieldCheck} label="Faculty Members" value={stats.teachers} color="text-emerald-500" />
                    <StatCard icon={BookOpen} label="Course Tutors" value={stats.tutors} color="text-purple-500" />
                    <StatCard icon={LayoutGrid} label="Departments" value={stats.departments} color="text-orange-500" />
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
