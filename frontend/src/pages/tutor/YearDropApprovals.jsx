import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { 
    CheckCircle2, 
    XCircle, 
    Clock, 
    Trash2, 
    ArrowLeft, 
    Search, 
    Hash, 
    Mail 
} from 'lucide-react';

const CourseDropApprovals = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await API.get('/tutor/year-drops');
            setRequests(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;
        try {
            await API.put(`/tutor/year-drops/${id}`, { status });
            fetchRequests();
        } catch (err) {
            alert('Failed to update request status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this request record?')) return;
        try {
            await API.delete(`/tutor/year-drops/${id}`);
            fetchRequests();
        } catch (err) {
            alert('Failed to delete request');
        }
    };

    const filteredRequests = requests.filter(r =>
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
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/tutor')}
                            className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Course Drop Approval</h1>
                            <p className="text-slate-400 text-sm mt-1">Review and manage student academic break requests</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name or ID..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-blue-600 transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-4">
                    {filteredRequests.map((req) => (
                        <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
                            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                                {/* Student Info */}
                                <div className="flex items-center gap-4 min-w-[300px]">
                                    <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                                    {req.photo ? (
                                        <img src={req.photo} alt={req.username} className="h-full w-full object-cover" />
                                    ) : (
                                        req.username ? req.username[0].toUpperCase() : '?'
                                    )}
                                </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{req.username}</h3>
                                        <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                                            <span className="flex items-center gap-1.5"><Hash size={14} /> {req.register_number}</span>
                                            <span className="h-1 w-1 bg-slate-800 rounded-full" />
                                            <span className="flex items-center gap-1.5"><Mail size={14} /> {req.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Context */}
                                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Sem</p>
                                        <p className="text-white font-semibold">Semester {req.last_semester}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Academic Year</p>
                                        <p className="text-white font-semibold">{req.current_year}</p>
                                    </div>
                                    <div className="space-y-1 lg:col-span-2">
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</p>
                                        <p className="text-slate-300 text-sm italic line-clamp-2">"{req.reason}"</p>
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 w-full lg:w-auto border-t lg:border-t-0 border-slate-800 pt-6 lg:pt-0">
                                    <div className={`px-4 py-2 rounded-lg text-xs font-bold ${
                                        req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                        req.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                    }`}>
                                        {req.status.toUpperCase()}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {req.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'approved')}
                                                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(req.id, 'rejected')}
                                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                onClick={() => handleDelete(req.id)}
                                                className="p-2 hover:bg-slate-800 text-slate-500 hover:text-white rounded-lg transition-colors"
                                                title="Delete Record"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredRequests.length === 0 && (
                        <div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-20 text-center">
                            <Clock size={48} className="mx-auto text-slate-700 mb-4" />
                            <p className="text-white font-medium">No pending requests found</p>
                            <p className="text-slate-500 text-sm mt-1">Requests for course drop will appear here for your review.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDropApprovals;
