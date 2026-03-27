import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    User, 
    ArrowRight,
    ShieldCheck,
    Users,
    AlertCircle,
    Hash,
    Mail,
    Search
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const RequestVerification = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await API.get('/tutor/students');
            setRequests(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        const actionText = status === 'cleared' ? 'approve' : 'reject';
        if (!window.confirm(`Are you sure you want to ${actionText} TC for this student?`)) return;
        try {
            await API.post(`/tutor/final-approval`, { student_id: id, status: status });
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update request');
        }
    };

    const filteredRequests = requests
        .filter(r => r.current_status === 'in_progress')
        .filter(r =>
            (r.username || '').toLowerCase().includes(search.toLowerCase()) ||
            (r.register_number || '').toLowerCase().includes(search.toLowerCase())
        );

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-400">Loading requests...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Request Verification</h1>
                            <p className="text-slate-400 text-sm mt-1">Review student applications and provide final TC approval</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Find student..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-600 transition-colors text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Students List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map((req) => (
                        <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 hover:border-slate-700 transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 font-bold border border-slate-700 overflow-hidden">
                                    {req.photo ? (
                                        <img src={req.photo} alt={req.username} className="h-full w-full object-cover" />
                                    ) : (
                                        req.username ? req.username[0].toUpperCase() : <User size={18} />
                                    )}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                    req.current_status === 'cleared' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                    req.current_status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}>
                                    {req.current_status.replace('_', ' ')}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                    {req.username}
                                </h3>
                                <div className="space-y-2 mt-3">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Hash size={14} className="text-slate-600" />
                                        <span>{req.register_number}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Mail size={14} className="text-slate-600" />
                                        <span className="truncate">{req.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 mt-auto border-t border-slate-800 flex items-center gap-3">
                                {req.current_status === 'in_progress' ? (
                                    <>
                                        <button 
                                            onClick={() => navigate(`/tutor/conduct/${req.id}`)}
                                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-600/10"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(req.id, 'rejected')}
                                            className="flex-1 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 text-xs font-bold transition-all"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : req.current_status === 'cleared' ? (
                                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold py-1.5 uppercase tracking-wide">
                                        <CheckCircle2 size={14} />
                                        <span>Verification Complete</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold py-1.5 uppercase tracking-wide italic">
                                        <Clock size={14} />
                                        <span>Awaiting Submission</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {filteredRequests.length === 0 && (
                        <div className="col-span-full py-20 bg-slate-900 border border-slate-800 border-dashed rounded-2xl text-center space-y-4">
                            <Users size={48} className="mx-auto text-slate-700 mb-2" />
                            <h3 className="text-lg font-bold text-white">No Students</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                No students found in your assigned batch.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestVerification;
