import { useState, useEffect } from 'react';
import API from '../../services/api';
import { UserPlus, ShieldCheck, ArrowRight, Settings } from 'lucide-react';

const CreateUser = () => {
    const [selectedRole, setSelectedRole] = useState('teacher');
    const [academicYears, setAcademicYears] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const [ayRes, deptRes] = await Promise.all([
                API.get('/admin/academic-years'),
                API.get('/admin/departments')
            ]);
            setAcademicYears(ayRes.data || []);
            setDepartments(deptRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        try {
            await API.post('/admin/users', data);
            alert('User registered successfully');
            e.target.reset();
            setSelectedRole('teacher');
        } catch (err) {
            alert('Registration failure: ' + (err.response?.data?.message || 'Unknown error'));
        } finally {
            btn.disabled = false;
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <UserPlus size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">User Creation</h1>
                        <p className="text-slate-400 text-sm mt-1">Provision new accounts and roles</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                                <input name="username" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors" placeholder="John Doe" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                                <input name="email" type="email" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors" placeholder="john@college.edu" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                                <input name="password" type="password" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors" placeholder="••••••••" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">User Role</label>
                                    <select 
                                        name="role" 
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors appearance-none cursor-pointer" 
                                        required
                                    >
                                        <option value="teacher">Faculty</option>
                                        <option value="tutor">Tutor</option>
                                    </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/50">
                            {(selectedRole === 'tutor' || selectedRole === 'both') && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Tutor Batch Dept.</label>
                                        <select name="department_id" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors cursor-pointer" required>
                                            <option value="">Select...</option>
                                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Operational Batch</label>
                                        <select name="academic_year_id" className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors cursor-pointer" required>
                                            <option value="">Select...</option>
                                            {academicYears.map(y => <option key={y.id} value={y.id}>{y.year_range}</option>)}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        <button type="submit" className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center justify-center gap-2 group mt-4 shadow-lg shadow-blue-600/20">
                            <span>Register User</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
