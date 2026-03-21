import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
    Users, 
    CheckCircle2, 
    Clock, 
    AlertTriangle,
    TrendingUp,
    LayoutDashboard
} from 'lucide-react';

const TutorOverview = () => {
    const [stats, setStats] = useState({ total: 0, cleared: 0, pending: 0, yearDrops: 0, department_name: '', year_range: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/tutor/stats');
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    const cards = [
        { 
            label: 'Assigned Students', 
            count: stats.total, 
            icon: Users, 
            color: 'bg-blue-500', 
            desc: 'Total students in your batch' 
        },
        { 
            label: 'Cleared Students', 
            count: stats.cleared, 
            icon: CheckCircle2, 
            color: 'bg-emerald-500', 
            desc: 'Successfully completed clearance' 
        },
        { 
            label: 'Pending Clearance', 
            count: stats.pending, 
            icon: Clock, 
            color: 'bg-amber-500', 
            desc: 'Students yet to be cleared' 
        },
        { 
            label: 'Course Drop Requests', 
            count: stats.yearDrops, 
            icon: AlertTriangle, 
            color: 'bg-rose-500', 
            desc: 'Pending academic break requests' 
        },
    ];

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <LayoutDashboard size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Tutor Overview</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-blue-500 font-bold uppercase tracking-wider text-xs bg-blue-500/10 px-2 py-1 rounded-md">
                                    {stats.department_name}
                                </span>
                                <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] bg-slate-800 px-2 py-1 rounded-md">
                                    Batch {stats.year_range}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-slate-700 transition-all group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 h-24 w-24 ${card.color}/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform`} />
                            
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-xl ${card.color}/10 text-white shadow-sm`}>
                                    <card.icon size={24} className={card.color.replace('bg-', 'text-')} />
                                </div>
                                <div className="text-slate-500 flex items-center gap-1 text-[10px] uppercase font-black tracking-widest">
                                    <TrendingUp size={12} /> Live
                                </div>
                            </div>

                            <div>
                                <h3 className="text-3xl font-extrabold text-white tracking-tight">{card.count}</h3>
                                <p className="text-slate-400 font-bold text-sm mt-1">{card.label}</p>
                                <p className="text-slate-600 text-xs mt-2 font-medium">{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 rounded-full" />
                        <h2 className="text-xl font-bold text-white mb-2">Welcome Back, Tutor</h2>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                            You are managing the clearance and academic status for your assigned department. 
                            Use the sidebar to verify TC requests or process course-drop approvals.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-900/20 rounded-3xl p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-blue-400 mb-4">
                            <CheckCircle2 size={24} />
                            <span className="font-bold uppercase tracking-wider text-sm">System Status</span>
                        </div>
                        <p className="text-blue-100 font-medium tracking-tight">
                            All student activities are being logged. Final TC verification is only available after departmental dues are cleared.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorOverview;
