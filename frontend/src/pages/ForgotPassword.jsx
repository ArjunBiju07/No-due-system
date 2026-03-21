import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Hash, Calendar, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import API from '../services/api';

const ForgotPassword = () => {
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [dob, setDob] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            await API.post('/auth/reset-password-direct', {
                admission_number: admissionNumber,
                dob: dob,
                new_password: newPassword
            });
            setIsSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative">
                <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center text-center">
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 shadow-xl shadow-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Password Reset!</h1>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        Your password has been successfully updated. You can now sign in with your new credentials.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                    >
                        Go to Login <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-800/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />
            </div>

            <div className="w-full max-w-[420px] relative z-10 flex flex-col">
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-white shadow-xl shadow-blue-900/20 mb-6 font-bold">
                        <Shield size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Direct Reset</h1>
                    <p className="text-slate-400 text-sm">Verify your identity to reset your password</p>
                </div>

                <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[24px] p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 rounded-xl bg-red-500/10 py-3 px-4 text-sm font-medium text-red-500 border border-red-500/20 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Hash size={14} className="text-blue-500" /> Admission Number
                            </label>
                            <input
                                type="text"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder:text-slate-700 hover:border-slate-700 focus:border-blue-600 focus:bg-[#020617] outline-none text-sm transition-all"
                                value={admissionNumber}
                                onChange={(e) => setAdmissionNumber(e.target.value)}
                                placeholder="e.g. ADM2023001"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={14} className="text-blue-500" /> Date of Birth
                            </label>
                            <input
                                type="date"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder:text-slate-700 hover:border-slate-700 focus:border-blue-600 focus:bg-[#020617] outline-none text-sm transition-all"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-2 border-t border-slate-800/50 my-2"></div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Lock size={14} className="text-blue-500" /> New Password
                            </label>
                            <input
                                type="password"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder:text-slate-700 hover:border-slate-700 focus:border-blue-600 focus:bg-[#020617] outline-none text-sm transition-all"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Lock size={14} className="text-blue-500" /> Confirm New Password
                            </label>
                            <input
                                type="password"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder:text-slate-700 hover:border-slate-700 focus:border-blue-600 focus:bg-[#020617] outline-none text-sm transition-all"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-600/20"
                        >
                            {loading ? 'Verifying & Updating...' : 'Reset Password'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm text-slate-400">
                    <Link to="/login" className="flex items-center justify-center gap-2 text-blue-500 font-semibold hover:text-blue-400 transition-colors">
                        <ArrowLeft size={18} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
