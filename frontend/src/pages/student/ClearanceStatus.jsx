import { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
    CheckCircle2, 
    Clock, 
    XCircle, 
    Send, 
    Info, 
    BookOpen, 
    AlertCircle, 
    FileText,
    Download,
    Trophy
} from 'lucide-react';

const ClearanceStatus = () => {
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (statusData?.info?.year_drop_status === 'pending' || statusData?.info?.year_drop_status === 'approved') {
            alert('Cannot apply for No Due Certificate while a Course Drop request is active.');
            return;
        }

        const confirmSubmit = window.confirm("Are you sure you want to submit your No Due Certificate application?");
        if (!confirmSubmit) return;

        try {
            await API.post('/student/apply');
            fetchStatus();
        } catch (err) {
            alert('Failed to apply');
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const response = await API.get('/student/download-pdf', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Clearance_${info.register_number}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            alert('Failed to generate PDF. Please try again.');
            console.error(err);
        }
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case 'cleared': return {
                icon: <CheckCircle2 className="text-emerald-500" size={24} />,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20'
            };
            case 'due': return {
                icon: <XCircle className="text-red-500" size={24} />,
                color: 'text-red-500',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20'
            };
            default: return {
                icon: <Clock className="text-slate-400" size={24} />,
                color: 'text-slate-400',
                bg: 'bg-slate-800',
                border: 'border-slate-700'
            };
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-400">Loading status details...</p>
            </div>
        </div>
    );

    if (!statusData || !statusData.info) return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
                <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto">
                    <AlertCircle size={28} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">Profile Not Found</h2>
                    <p className="text-sm text-slate-400">
                        We could not load your student details. Please contact administration.
                    </p>
                </div>
            </div>
        </div>
    );

    const { info, clearance } = statusData || {};
    const clearedCount = (clearance || []).filter(c => c.status === 'cleared').length;
    const totalCount = (clearance || []).length;

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Rejection Alert - Now at the Top */}
                {info?.current_status === 'rejected' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="h-12 w-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                            <AlertCircle size={28} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-red-500 font-black uppercase tracking-widest text-sm mb-1">Application Rejected</h3>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">
                                Your previous No Due Certificate request was declined by the tutor. Please review your departmental statuses below, settle any outstanding dues and contact your tutor before resubmitting your application.
                            </p>
                        </div>
                    </div>
                )}

                {/* Course Drop Rejection Alert */}
                {info?.year_drop_status === 'rejected' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="h-12 w-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                            <AlertCircle size={28} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-red-500 font-black uppercase tracking-widest text-sm mb-1">Course Drop Rejected</h3>
                            <p className="text-slate-300 text-sm font-medium leading-relaxed">
                                Your previous Course Drop request was declined by the tutor. You can now apply for a standard No Due Certificate once all your departmental dues are settled.
                            </p>
                        </div>
                    </div>
                )}

                {/* Header Profile */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-blue-500 font-semibold text-sm">Clearance Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Departmental Status</h1>
                        <p className="text-slate-400 text-sm max-w-xl">
                            Track your departmental clearance status. All departments must be cleared before you can apply for your No Due Certificate.
                        </p>
                    </div>
                    
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center min-w-[200px]">
                        <p className="text-sm font-medium text-slate-400 mb-2">Departments Cleared</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-white leading-none">{clearedCount}</span>
                            <span className="text-xl text-slate-500 leading-none mb-1">/ {totalCount}</span>
                        </div>
                    </div>
                </div>

                {/* PDF Header (Only visible during print) */}
                <div className="hidden print:block bg-white p-10 text-black border-2 border-black rounded-lg">
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-4xl font-black uppercase tracking-tighter">No Due Certificate</h1>
                        <p className="text-xl border-y border-black py-2">Official Student Clearance Document</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 text-lg mb-10">
                        <div>
                            <p><span className="font-bold">Student Name:</span> {info.username}</p>
                            <p><span className="font-bold">Register No:</span> {info.register_number}</p>
                        </div>
                        <div>
                            <p><span className="font-bold">Department:</span> {info.department_name}</p>
                            <p><span className="font-bold">Academic Year:</span> {info.year_range}</p>
                        </div>
                    </div>
                </div>

                {/* Clearance Grid */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 print:bg-white print:border-black print:text-black">
                    <div className="flex items-center gap-3 mb-8 print:hidden">
                        <div className="h-10 w-10 text-white rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                            <BookOpen size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Department Details</h2>
                    </div>

                    <div className="space-y-4">
                        {Array.from(clearance || []).sort((a, b) => a.duty_name.localeCompare(b.duty_name)).map((item) => {
                            const theme = getStatusTheme(item.status);
                            return (
                                <div
                                    key={item.id}
                                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 print:border-black print:bg-white print:text-black"
                                >
                                    <div className={`p-3 rounded-lg ${theme.bg} flex-shrink-0 print:border print:border-black`}>
                                        {theme.icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-white mb-1 print:text-black">{item.duty_name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-400 print:text-black">
                                            <span className="text-slate-500 font-medium">Remarks:</span>
                                            <p className="truncate italic">
                                                {item.remarks ? `"${item.remarks}"` : 'No recorded issues'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest whitespace-nowrap ${theme.bg} ${theme.color} border ${theme.border} print:border-black print:text-black`}>
                                        {item.status.toUpperCase()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Final Action Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col lg:flex-row gap-8 items-center justify-between print:hidden">
                    <div className="max-w-xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-600/10 text-blue-500">
                                <Trophy size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                Final Application
                            </h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                            Upon total clearance, you can submit your final certificate request. 
                            Approved applications allow you to download your official digital No Due Certificate.
                        </p>
                    </div>

                    <div className="w-full lg:w-96 flex flex-col gap-4">
                        {(info.current_status === 'cleared' || info.year_drop_status === 'approved') ? (
                            <div className="space-y-4 w-full">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center mb-4">
                                    <CheckCircle2 className="mx-auto text-emerald-500 mb-2" size={32} />
                                    <p className="text-emerald-500 font-bold">
                                        {info.year_drop_status === 'approved' ? 'Course Drop Approved' : 'TC Application Approved'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="w-full h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-3 border border-slate-700 hover:border-slate-500"
                                >
                                    <Download size={20} />
                                    Download Clearance PDF
                                </button>
                            </div>
                        ) : info.current_status === 'in_progress' ? (
                            <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-6 text-center">
                                <Clock className="mx-auto text-blue-500 mb-2" size={32} />
                                <p className="text-blue-500 font-bold text-lg">Verification In Progress</p>
                                <p className="text-[10px] text-blue-500/60 uppercase tracking-widest mt-1 font-black leading-tight border-t border-blue-500/10 pt-3">
                                    Your application has been submitted.<br/>Awaiting final verification by Tutor.
                                </p>
                            </div>
                        ) : info.year_drop_status === 'pending' ? (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 text-center">
                                <Clock className="mx-auto text-orange-500 mb-2" size={32} />
                                <p className="text-orange-500 font-bold text-lg">Course Drop Pending</p>
                                <p className="text-[10px] text-orange-500/60 uppercase tracking-widest mt-1 font-black leading-tight border-t border-orange-500/10 pt-3">
                                    You have a pending Course Drop request.<br/>You cannot apply for No Due Certificate at this time.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <button
                                    onClick={handleApply}
                                    disabled={clearedCount < totalCount}
                                    className={`w-full h-14 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg group ${
                                        clearedCount < totalCount 
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 shadow-lg'
                                    }`}
                                >
                                    <Send size={20} className={clearedCount < totalCount ? '' : 'group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform'} />
                                    {info.current_status === 'rejected' ? 'Resubmit No Due Certificate' : 'Submit No Due Certificate'}
                                </button>
                                
                                {clearedCount < totalCount && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/5 border border-red-500/10 rounded-xl">
                                        <AlertCircle size={14} className="text-red-500" />
                                        <p className="text-[11px] text-red-500/80 font-medium italic">
                                            Clear remaining {totalCount - clearedCount} dues to enable submission
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClearanceStatus;
