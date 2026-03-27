import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
    CheckCircle2, 
    User, 
    Hash, 
    Mail, 
    Search,
    ShieldCheck,
    Users,
    RotateCcw
} from 'lucide-react';

const ApprovedStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchApproved();
    }, []);

    const fetchApproved = async () => {
        try {
            const { data } = await API.get('/tutor/students');
            // Filter cleared students OR approved course drops
            setStudents((data || []).filter(s => s.current_status === 'cleared' || s.year_drop_status === 'approved'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (student) => {
        const isYearDrop = student.year_drop_status === 'approved';
        if (!window.confirm(`Are you sure you want to revoke this ${isYearDrop ? 'Course Drop' : 'TC'} approval?`)) return;
        try {
            if (isYearDrop && student.year_drop_id) {
                await API.put(`/tutor/year-drops/${student.year_drop_id}`, { status: 'pending' });
            } else {
                await API.post(`/tutor/final-approval`, { student_id: student.id, status: 'in_progress' });
            }
            fetchApproved();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to revoke approval');
        }
    };

    const filteredStudents = students.filter(s =>
        (s.username || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.register_number || '').toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Approved Students</h1>
                            <p className="text-slate-400 text-sm mt-1">List of students who have completed the final TC clearance</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Find student..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-emerald-600 transition-colors text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Students Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => (
                        <div key={student.id} className="bg-slate-900 border border-emerald-500/10 rounded-2xl p-6 flex flex-col gap-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="flex items-start justify-between">
                                <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-emerald-500 font-bold border border-slate-700 shadow-inner overflow-hidden">
                                    {student.photo ? (
                                        <img src={student.photo} alt={student.username} className="h-full w-full object-cover" />
                                    ) : (
                                        student.username ? student.username[0].toUpperCase() : <User size={18} />
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        Verified
                                    </div>
                                    <button 
                                        onClick={() => handleRevoke(student)}
                                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/10 transition-colors group/revoke"
                                    >
                                        <RotateCcw size={12} className="group-hover/revoke:-rotate-45 transition-transform" />
                                        Revoke Approval
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                                    {student.username}
                                </h3>
                                <div className="space-y-2 mt-3 text-xs text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Hash size={14} className="text-slate-600" />
                                        <span>{student.register_number}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-slate-600" />
                                        <span className="truncate">{student.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 mt-auto border-t border-slate-800 flex items-center">
                                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                                    <ShieldCheck size={14} />
                                    <span>{student.year_drop_status === 'approved' ? 'Course Drop Authorized' : 'TC Authorized'}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredStudents.length === 0 && (
                        <div className="col-span-full py-20 bg-slate-900 border border-slate-800 border-dashed rounded-3xl text-center space-y-4">
                            <Users size={48} className="mx-auto text-slate-700 opacity-20" />
                            <h3 className="text-xl font-bold text-white">No Approved Students</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                No students have completed the final clearance process yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApprovedStudents;
