import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Access Denied.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative">
            {/* Background Accents (Static) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-800/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />
            </div>

            <div className="w-full max-w-[420px] relative z-10 flex flex-col">
                {/* Logo Area */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 text-white shadow-xl shadow-blue-900/20 mb-6">
                        <Shield size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Login Here</h1>
                    <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
                </div>

                {/* Main Content Box */}
                <div className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[24px] p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 rounded-xl bg-red-500/10 py-3 px-4 text-sm font-medium text-red-500 border border-red-500/20 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                <Mail size={16} className="text-slate-500" /> Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 hover:border-slate-700 focus:border-blue-600 focus:bg-[#020617] outline-none text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@domain.edu"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                    <Lock size={16} className="text-slate-500" /> Password
                                </label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-blue-500 hover:text-blue-400">
                                    Forgot Password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder:text-slate-600 hover:border-slate-700 focus:border-blue-600 focus:bg-[#020617] outline-none text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                            {!isSubmitting && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="font-semibold text-blue-500 hover:text-blue-400 inline-block pb-1 border-b border-transparent hover:border-blue-400">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
