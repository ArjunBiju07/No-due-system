import { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
    Search,
    Check, 
    AlertCircle, 
    User, 
    ShieldCheck, 
    SearchX,
    Trash2,
    Loader2,
    X
} from 'lucide-react';

const ShowDues = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [dutyName, setDutyName] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [localReasons, setLocalReasons] = useState([]);
    const [updating, setUpdating] = useState(false);
    const { selectedDuty } = useAuth();

    useEffect(() => {
        fetchStudents(selectedDuty);
    }, [selectedDuty]);

    const fetchStudents = async (dutyId = null) => {
        try {
            const url = dutyId ? `/teacher/students?duty_id=${dutyId}` : '/teacher/students';
            const { data } = await API.get(url);
            const fetchedStudents = data.students || [];
            setStudents(fetchedStudents);
            setDutyName(data.dutyName || 'Unassigned');

            // If we have a selected student, update their data (keeps the modal sync'd)
            if (selectedStudent) {
                const updated = fetchedStudents.find(s => s.id === selectedStudent.id);
                if (updated) {
                    setSelectedStudent(updated);
                    parseReasons(updated.remarks);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const parseReasons = (remarksStr) => {
        if (!remarksStr) {
            setLocalReasons([]);
            return;
        }
        setLocalReasons(remarksStr.split('\n\n').filter(r => r.trim() !== ''));
    };

    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        parseReasons(student.remarks);
    };

    const handleUpdateStatus = async (status, remarks) => {
        setUpdating(true);
        try {
            await API.put('/teacher/update-status', { 
                student_id: selectedStudent.id, 
                duty_id: selectedDuty,
                status, 
                remarks: remarks || '' 
            });
            if (status === 'cleared') {
                setSelectedStudent(null);
            }
            fetchStudents();
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteReason = async (indexToDelete) => {
        const updatedReasons = localReasons.filter((_, i) => i !== indexToDelete);
        
        if (updatedReasons.length === 0) {
            // If all deleted, clear the due entirely
            handleUpdateStatus('cleared', '');
        } else {
            // Re-join remaining and update
            const newRemarks = updatedReasons.map((r, i) => {
                // Remove existing numbering if present so we can re-number properly
                const clean = r.replace(/^\d+\.\s*/, '');
                return updatedReasons.length > 1 ? `${i + 1}. ${clean}` : clean;
            }).join('\n\n');
            
            handleUpdateStatus('due', newRemarks);
        }
    };

    const filteredStudents = (students || [])
        .filter(s => s.status === 'due')
        .filter(s => {
            const searchTxt = search.toLowerCase();
            return (s.username || '').toLowerCase().includes(searchTxt) || 
                   (s.register_number || '').toLowerCase().includes(searchTxt);
        });

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                            <AlertCircle size={32} />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-white">Student Dues List</h1>
                            <p className="text-slate-400 text-sm">Reviewing outstanding dues for <span className="text-blue-400 font-semibold">{dutyName}</span></p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search among debtors..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-600 transition-colors text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Register No</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-slate-500">
                                                <SearchX size={48} className="opacity-20" />
                                                <p className="text-lg font-medium">No students with outstanding dues found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-red-500 font-bold border border-slate-700">
                                                        {student.username ? student.username[0].toUpperCase() : <User size={18} />}
                                                    </div>
                                                    <span className="text-white font-medium">{student.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-slate-300 font-mono text-sm bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                                                    {student.register_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleOpenModal(student)}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/10 active:scale-95"
                                                >
                                                    Open
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Overlay */}
                {selectedStudent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <div 
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                            onClick={() => setSelectedStudent(null)}
                        />
                        <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                            {/* Modal Header/Profile Section */}
                            <div className="relative h-32 bg-gradient-to-r from-red-600 to-rose-600">
                                <button 
                                    onClick={() => setSelectedStudent(null)}
                                    className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="px-8 pb-8">
                                <div className="relative -mt-16 flex flex-col md:flex-row items-end gap-6 mb-8">
                                    <div className="h-32 w-32 rounded-3xl bg-slate-800 border-4 border-slate-900 shadow-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-red-500 font-bold text-5xl">
                                        {selectedStudent.photo ? (
                                            <img 
                                                src={selectedStudent.photo} 
                                                alt="Student" 
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            selectedStudent.username ? selectedStudent.username[0].toUpperCase() : <User size={48} />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <h3 className="text-3xl font-black text-white">{selectedStudent.username}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-red-500 font-bold text-sm uppercase tracking-widest">
                                            <span>{selectedStudent.register_number}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-700" />
                                            <span>ID: {selectedStudent.id}</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter border bg-red-500/10 text-red-500 border-red-500/20">
                                        DUE RECORDED
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Admission Number</p>
                                        <p className="text-white font-bold">{selectedStudent.admission_number || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Date of Birth</p>
                                        <p className="text-white font-bold">
                                            {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString('en-GB') : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Branch (Department)</p>
                                        <p className="text-white font-bold">{selectedStudent.branch_name}</p>
                                    </div>
                                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Assigned Tutor</p>
                                        <p className="text-white font-bold">{selectedStudent.tutor_name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Recorded Reasons</label>
                                        
                                        <div className="space-y-3">
                                            {localReasons.length === 0 ? (
                                                <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 text-slate-500 text-sm italic text-center">
                                                    No specific reason provided
                                                </div>
                                            ) : (
                                                localReasons.map((reason, idx) => (
                                                    <div key={idx} className="relative flex items-center justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10 animate-in slide-in-from-right-4 duration-300">
                                                        <div className="text-red-200 text-sm pr-16">
                                                            {reason}
                                                        </div>
                                                        <button 
                                                            disabled={updating}
                                                            onClick={() => handleDeleteReason(idx)}
                                                            className="absolute right-3 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50 transition-all border border-emerald-500/20"
                                                            title="Clear this specific due"
                                                        >
                                                            {updating ? <Loader2 size={12} className="animate-spin" /> : 'Clear'}
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        disabled={updating}
                                        onClick={() => handleUpdateStatus('cleared', 'Due cleared by faculty')}
                                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        {updating ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} strokeWidth={3} />}
                                        <span>Clear Student Due (All)</span>
                                    </button>
                                    
                                    <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-black">
                                        Student will be immediately notified of clearance
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowDues;
