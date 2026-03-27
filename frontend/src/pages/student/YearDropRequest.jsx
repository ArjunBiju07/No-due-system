import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Send, AlertTriangle, ArrowLeft, ChevronDown, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseDropRequest = () => {
    const [reason, setReason] = useState('');
    const [lastSemester, setLastSemester] = useState('');
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const { data } = await API.get('/student/status');
            setStatusData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setDataLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const pendingCount = statusData?.clearance ? statusData.clearance.filter(c => c.status !== 'cleared').length : 0;
        if (pendingCount > 0) {
            alert(`You have ${pendingCount} pending dues. Please clear them before submitting a Course Drop request.`);
            return;
        }

        const hasNoDueActive = statusData?.info?.current_status === 'in_progress' || statusData?.info?.current_status === 'cleared';
        if (hasNoDueActive) {
            alert('Cannot submit a Course Drop request while you have an active No Due Certificate request.');
            return;
        }

        const confirmSubmit = window.confirm("Are you sure you want to submit your Course Drop request?");
        if (!confirmSubmit) return;

        setLoading(true);
        try {
            await API.post('/student/year-drop', {
                reason,
                last_semester: lastSemester,
                current_year: currentYear
            });
            alert('Your request for course drop has been submitted.');
            navigate('/student');
        } catch (err) {
            alert('Failed to submit request.');
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="h-12 w-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    const pendingDues = statusData?.clearance ? statusData.clearance.filter(c => c.status !== 'cleared') : [];
    const hasDues = pendingDues.length > 0;
    const hasNoDueActive = statusData?.info?.current_status === 'in_progress' || statusData?.info?.current_status === 'cleared';
    const isRestricted = hasDues || hasNoDueActive;

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                    <button
                        onClick={() => navigate('/student')}
                        className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex-shrink-0 flex-start self-start md:self-auto"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-500 font-semibold text-sm">Academic Forms</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Course Drop Request
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Submit a formal request to take an academic break. This requires administrative approval and will pause your enrollment status.
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                    {/* Warning Banner */}
                    {hasNoDueActive ? (
                        <div className="flex items-start gap-4 mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
                            <div>
                                <h2 className="text-base font-bold text-red-500 mb-1">Submission Restricted</h2>
                                <p className="text-sm text-red-500/80 leading-relaxed">
                                    You cannot submit a Course Drop request because you have an <strong>active No Due Certificate</strong> application.
                                </p>
                            </div>
                        </div>
                    ) : hasDues ? (
                        <div className="flex items-start gap-4 mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
                            <div>
                                <h2 className="text-base font-bold text-red-500 mb-1">Submission Restricted</h2>
                                <p className="text-sm text-red-500/80 leading-relaxed">
                                    You cannot submit a Course Drop request because you have <strong>{pendingDues.length} pending dues</strong>. Please clear all departmental dues before proceeding.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-4 mb-8 p-5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                            <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={24} />
                            <div>
                                <h2 className="text-base font-bold text-orange-500 mb-1">Important Consideration</h2>
                                <p className="text-sm text-orange-500/80 leading-relaxed">
                                    A course drop will temporarily suspend your academic progress. Ensure you have consulted with your tutor or department head before submitting this form.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Last Semester Select */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Current Semester</label>
                                <div className="relative">
                                    <select
                                        value={lastSemester}
                                        onChange={(e) => setLastSemester(e.target.value)}
                                        disabled={isRestricted}
                                        className={`w-full appearance-none bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer ${isRestricted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                    >
                                        <option value="" disabled className="text-slate-500">Select Semester</option>
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>Semester {num}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                                </div>
                            </div>

                            {/* Current Year Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Current Academic Year</label>
                                <input
                                    type="text"
                                    value={currentYear}
                                    readOnly
                                    className="w-full bg-slate-800/50 border border-slate-800 text-slate-400 rounded-xl px-4 py-3.5 cursor-not-allowed font-medium"
                                />
                            </div>
                        </div>

                        {/* Reason Selection */}
                        <div className={`space-y-4 ${isRestricted ? 'opacity-50 pointer-events-none' : ''}`}>
                            <label className="text-sm font-medium text-slate-300 ml-1">Reason for Request</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'medical', label: 'Medical Grounds', icon: '🏥' },
                                    { id: 'financial', label: 'Financial Difficulty', icon: '💰' },
                                    { id: 'family', label: 'Family Emergency', icon: '👨‍👩-👧' },
                                    { id: 'personal', label: 'Personal Reasons', icon: '👤' },
                                    { id: 'academic', label: 'Academic Pressure', icon: '📚' },
                                    { id: 'other', label: 'Other', icon: '✨' }
                                ].map((option) => (
                                    <label
                                        key={option.id}
                                        className={`
                                            relative flex items-center p-4 rounded-xl border cursor-pointer transition-all
                                            ${reason === option.label 
                                                ? 'bg-blue-600/10 border-blue-600 ring-1 ring-blue-600' 
                                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'}
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="reason"
                                            value={option.label}
                                            checked={reason === option.label}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="sr-only"
                                            required={!isRestricted}
                                        />
                                        <span className="text-2xl mr-4">{option.icon}</span>
                                        <span className={`font-medium ${reason === option.label ? 'text-blue-500' : 'text-slate-300'}`}>
                                            {option.label}
                                        </span>
                                        {reason === option.label && (
                                            <div className="absolute top-4 right-4 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                <div className="h-2 w-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || isRestricted}
                                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center gap-3 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border disabled:border-slate-700"
                            >
                                {loading ? (
                                    <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>{isRestricted ? (hasNoDueActive ? 'Request Restricted' : 'Clear Dues to Submit') : 'Submit Course Drop Request'}</span>
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseDropRequest;
