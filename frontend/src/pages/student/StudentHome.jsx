import { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { GraduationCap, MapPin, ShieldCheck, ArrowRight, AlertCircle, Hash, Building2, CheckCircle, Clock, Camera, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentHome = () => {
    const { user } = useAuth();
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const fileInputRef = useRef(null);
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
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingPhoto(true);
        const formData = new FormData();
        formData.append('photo', file);

        try {
            await API.post('/student/upload-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchStatus(); // Refresh data to show new photo
        } catch (err) {
            alert('Failed to upload photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-400">Loading student data...</p>
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
                <button 
                    onClick={() => navigate('/login')}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                    Return to Login
                </button>
            </div>
        </div>
    );

    const { info, clearance } = statusData;
    const clearedCount = clearance ? clearance.filter(c => c.status === 'cleared').length : 0;
    const totalCount = clearance ? (clearance.length || 1) : 1;
    const progress = Math.round((clearedCount / totalCount) * 100);

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <main className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="relative group">
                                <div className="h-24 w-24 rounded-2xl bg-slate-800 border-4 border-slate-900 shadow-xl overflow-hidden flex-shrink-0 relative flex items-center justify-center text-blue-500 font-bold text-4xl">
                                    {info.photo ? (
                                        <img 
                                            src={info.photo} 
                                            alt="Student" 
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        info.username ? info.username[0].toUpperCase() : <User size={40} />
                                    )}
                                    {uploadingPhoto && (
                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                                            <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingPhoto}
                                className="absolute -bottom-3 -right-3 h-10 w-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/20 border-4 border-slate-900 transition-all active:scale-95 disabled:opacity-50"
                                title="Change Profile Photo"
                            >
                                <Camera size={16} />
                            </button>
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={fileInputRef} 
                                onChange={handlePhotoUpload} 
                                className="hidden" 
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        Hello, {info.username ? info.username.split(' ')[0] : 'Student'}
                                    </h1>
                                    <p className="text-sm text-slate-400">Student Portal Dashboard</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <Hash size={16} className="text-blue-500" />
                                <span>{info.register_number}</span>
                            </div>
                            <div className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <Building2 size={16} className="text-blue-500" />
                                <span>{info.department_name}</span>
                            </div>
                            <div className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <span className="text-blue-500 font-semibold">{info.year_range}</span>
                            </div>
                        </div>
                    </div>
                </div>

                    {/* Progress Indicator */}
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex items-center gap-6 min-w-[200px]">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Clearance</p>
                            <p className="text-3xl font-bold text-white">{progress}%</p>
                        </div>
                        <div className="flex-1">
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Status Board - Left */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8 text-white">
                                <div>
                                    <h2 className="text-xl font-bold">Pending Dues</h2>
                                    <p className="text-sm text-slate-400 mt-1">Departments where clearance is required</p>
                                </div>
                                <button 
                                    onClick={() => navigate('/student/status')}
                                    className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    View All Details <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-start">
                                {clearance && clearance
                                    .filter(c => c.status !== 'cleared')
                                    .sort((a, b) => a.duty_name.localeCompare(b.duty_name))
                                    .slice(0, 4)
                                    .map((c) => (
                                    <div
                                        key={c.id}
                                        className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-center gap-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Clock size={20} className="text-red-500 flex-shrink-0" />
                                            <span className="text-sm font-medium text-slate-300 truncate">
                                                {c.duty_name}
                                            </span>
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 rounded-md inline-block self-start bg-red-500/10 text-red-400">
                                            Due Pending
                                        </span>
                                    </div>
                                ))}
                                {clearance && clearance.filter(c => c.status !== 'cleared').length === 0 && (
                                    <div className="col-span-full border border-slate-800 border-dashed rounded-xl p-8 text-center text-slate-400 flex flex-col items-center justify-center">
                                        <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-white font-bold mb-1">All Clear!</h3>
                                        <p className="text-sm">You have no pending dues at the moment.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Actions - Right */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Student Meta Details */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                                <MapPin size={18} className="text-blue-500" /> Account Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-slate-800 text-sm">
                                    <span className="text-slate-400">Role</span>
                                    <span className="font-medium text-white capitalize">{user.role}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-800 text-sm">
                                    <span className="text-slate-400">Identity</span>
                                    <span className="font-medium text-emerald-500">Verified</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-800 text-sm">
                                    <span className="text-slate-400">Email linked</span>
                                    <span className="font-medium text-white truncate max-w-[150px]" title={user.email}>{user.email}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 text-sm">
                                    <span className="text-slate-400">Tutor</span>
                                    <span className="font-medium text-white capitalize">{info.tutor_name || 'Not assigned'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentHome;
