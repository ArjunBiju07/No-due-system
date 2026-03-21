import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { 
    UserPlus, 
    Mail, 
    User, 
    Lock, 
    GraduationCap, 
    Building2, 
    Calendar,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Image as ImageIcon
} from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        department_id: '',
        academic_year_id: '',
        register_number: '',
        admission_number: '',
        dob: '',
        photo: null
    });
    const [departments, setDepartments] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, yearRes] = await Promise.all([
                    API.get('/public/departments'),
                    API.get('/public/academic-years')
                ]);
                setDepartments(deptRes.data);
                setAcademicYears(yearRes.data);
            } catch (err) {
                console.error('Failed to fetch registration data');
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'confirm_password') {
                    if (key === 'photo') {
                        if (formData.photo) submitData.append('photo', formData.photo);
                    } else {
                        submitData.append(key, formData[key]);
                    }
                }
            });
            
            await register(submitData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm";
    const labelClasses = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1";

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6">
            {/* Background Decorative Rings */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-2xl bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 sm:p-12 backdrop-blur-xl relative z-10 shadow-2xl">
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20">
                        <UserPlus size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Create Student Account</h1>
                    <p className="text-slate-400 max-w-sm">Join the No Due clearance system by providing your academic details below.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-medium">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="md:col-span-2">
                            <label className={labelClasses}>Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    className={`${inputClasses} pl-12`}
                                    placeholder="Enter your full name"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2">
                            <label className={labelClasses}>Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    className={`${inputClasses} pl-12`}
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Photo */}
                        <div className="md:col-span-2">
                            <label className={labelClasses}>Passport Size Photo</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className={`${inputClasses} pl-12 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600/20 file:text-blue-500 hover:file:bg-blue-600/30`}
                                    onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                                />
                            </div>
                        </div>

                        {/* Register Number */}
                        <div className="md:col-span-2">
                            <label className={labelClasses}>Register Number</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    className={`${inputClasses} pl-12`}
                                    placeholder="e.g. 2101010010"
                                    value={formData.register_number}
                                    onChange={(e) => setFormData({ ...formData, register_number: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Admission Number */}
                        <div>
                            <label className={labelClasses}>Admission Number</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    className={`${inputClasses} pl-12`}
                                    placeholder="e.g. 3121"
                                    value={formData.admission_number}
                                    onChange={(e) => setFormData({ ...formData, admission_number: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className={labelClasses}>Date of Birth</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="date"
                                    className={`${inputClasses} pl-12`}
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div>
                            <label className={labelClasses}>Department</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <select
                                    className={`${inputClasses} pl-12 appearance-none cursor-pointer`}
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                    required
                                >
                                    <option value="" className="bg-slate-900">Select Dept</option>
                                    {departments.map(d => <option key={d.id} value={d.id} className="bg-slate-900">{d.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Academic Year */}
                        <div>
                            <label className={labelClasses}>Academic Year</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <select
                                    className={`${inputClasses} pl-12 appearance-none cursor-pointer`}
                                    value={formData.academic_year_id}
                                    onChange={(e) => setFormData({ ...formData, academic_year_id: e.target.value })}
                                    required
                                >
                                    <option value="" className="bg-slate-900">Select Year</option>
                                    {academicYears.map(y => <option key={y.id} value={y.id} className="bg-slate-900">{y.year_range}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className={labelClasses}>Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    className={`${inputClasses} pl-12`}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className={labelClasses}>Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    className={`${inputClasses} pl-12`}
                                    placeholder="••••••••"
                                    value={formData.confirm_password}
                                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 transition-colors disabled:opacity-50 mt-4"
                    >
                        {isSubmitting ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">Already have an account?</p>
                    <Link 
                        to="/login" 
                        className="text-blue-500 hover:text-blue-400 text-sm font-semibold flex items-center gap-2"
                    >
                        Sign in now <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="mt-8 flex justify-center gap-6 opacity-30">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <CheckCircle2 size={12} /> Secure System
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <CheckCircle2 size={12} /> Data Protected
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

