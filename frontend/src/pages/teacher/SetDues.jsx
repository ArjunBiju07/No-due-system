import { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, AlertCircle, User, ShieldCheck, SearchX, Check, Loader2, X, Plus, Trash2 } from 'lucide-react';

const SetDues = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [dutyName, setDutyName] = useState('');
    const { selectedDuty } = useAuth();
    
    // Modal state
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [reasons, setReasons] = useState(['']);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchStudents(selectedDuty);
    }, [selectedDuty]);

    const fetchStudents = async (targetDutyId = null) => {
        try {
            const url = targetDutyId ? `/teacher/students?duty_id=${targetDutyId}` : '/teacher/students';
            const { data } = await API.get(url);
            setStudents(data.students || []);
            setDutyName(data.dutyName || '');
        } catch (err) {
            console.error('fetchStudents error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        // Pre-fill reasons if they already have remarks for this duty, else one empty reason
        if (student.remarks) {
            setReasons(student.remarks.split('\n\n').filter(r => r.trim() !== ''));
            setIsEditing(false); // View mode if dues exist
        } else {
            setReasons(['']);
            setIsEditing(true); // Edit mode for new entries
        }
    };

    const handleSaveStatus = async () => {
        const validReasons = reasons.map(r => r.trim()).filter(r => r !== '');

        if (validReasons.length === 0) {
            alert('Please enter at least one reason for marking this due.');
            return;
        }

        const consolidatedRemarks = validReasons.map((r, i) => validReasons.length > 1 ? `${i + 1}. ${r}` : r).join('\n\n');

        setSaving(true);
        try {
            await API.put('/teacher/update-status', {
                student_id: selectedStudent.id,
                duty_id: selectedDuty,
                status: 'due',
                remarks: consolidatedRemarks,
            });
            setSelectedStudent(null);
            fetchStudents(); // refresh the list
        } catch (err) {
            console.error('handleSaveStatus error:', err);
            alert('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = students.filter((s) => {
        const q = search.toLowerCase();
        return (
            (s.username || '').toLowerCase().includes(q) ||
            (s.register_number || '').toLowerCase().includes(q)
        );
    });

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* ── Page Header ── */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Set Student Dues</h1>
                            {dutyName ? (
                                <p className="text-slate-400 text-sm mt-1">
                                    Managing: <span className="text-blue-400 font-semibold">{dutyName}</span>
                                </p>
                            ) : (
                                <p className="text-red-400 text-sm mt-1">
                                    No duty assigned to your profile.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search name or register no..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-600 transition-colors text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* ── Student Table ── */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/50">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
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
                                                <p className="text-lg font-medium">No students found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 font-bold border border-slate-700">
                                                        {student.username ? student.username[0].toUpperCase() : <User size={18} />}
                                                    </div>
                                                    <div>
                                                        <span className="text-white font-medium block">{student.username}</span>
                                                    </div>
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
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                                    disabled={!selectedDuty}
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
            </div>

            {/* ── Modal ── */}
            {selectedStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        onClick={() => setSelectedStudent(null)}
                    />

                    {/* modal card */}
                    <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-fit max-h-[90vh] animate-in zoom-in-95 fade-in duration-300">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute right-6 top-6 z-50 h-10 w-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
                        >
                            <X size={20} />
                        </button>

                        {/* scrollable body */}
                        <div className="overflow-y-auto flex-1">
                            {/* coloured banner */}
                            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0"></div>

                            <div className="px-8 pb-8">
                                {/* student avatar + name */}
                                <div className="relative -mt-16 flex flex-col md:flex-row items-end gap-6 mb-8">
                                    <div className="h-32 w-32 rounded-3xl bg-slate-800 border-4 border-slate-900 shadow-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-blue-500 font-bold text-5xl">
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
                                        <div className="flex items-center gap-3 mt-1 text-blue-500 font-bold text-sm uppercase tracking-widest">
                                            <span>{selectedStudent.register_number}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-700" />
                                            <span>ID: {selectedStudent.id}</span>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter border bg-blue-500/10 text-blue-500 border-blue-500/20">
                                        SETTING DUE
                                    </div>
                                </div>

                                {/* Student Metadata Grid */}
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
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                                                <span>{isEditing ? 'Reasons for Due' : 'Currently Set Dues'}</span>
                                                {isEditing && <span className="text-blue-500 ml-2">* Required</span>}
                                            </label>
                                            
                                            {isEditing ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setReasons([...reasons, ''])}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                    Add Another
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(true)}
                                                    className="flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg transition-colors border border-amber-500/20"
                                                >
                                                    Edit Dues
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {reasons.length === 0 ? (
                                                <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800 text-slate-500 text-sm italic text-center">
                                                    No specific reason provided
                                                </div>
                                            ) : isEditing ? (
                                                reasons.map((reason, index) => (
                                                    <div key={index} className="relative flex items-start gap-2">
                                                        <textarea
                                                            rows={2}
                                                            className="w-full bg-slate-950/50 border border-slate-800 text-white text-sm rounded-2xl p-4 focus:outline-none focus:border-blue-500/40 transition-colors resize-none placeholder-slate-600"
                                                            placeholder={reasons.length > 1 ? `Enter reason #${index + 1}...` : "Enter the detailed reason for marking this student due..."}
                                                            value={reason}
                                                            onChange={(e) => {
                                                                const newReasons = [...reasons];
                                                                newReasons[index] = e.target.value;
                                                                setReasons(newReasons);
                                                            }}
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                reasons.map((reason, idx) => (
                                                    <div key={idx} className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 text-red-200 text-sm italic">
                                                        {reason}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={handleSaveStatus}
                                            disabled={saving}
                                            className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-600/20 transition-all font-black uppercase tracking-widest text-sm active:scale-[0.98]"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    <span>Submitting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle size={20} strokeWidth={3} />
                                                    <span>{selectedStudent.remarks ? 'Save Changes' : 'Set Student Due'}</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetDues;
