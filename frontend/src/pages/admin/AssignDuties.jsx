import { useState, useEffect } from 'react';
import API from '../../services/api';
import { ShieldCheck, BookOpen, Trash2, ArrowRight, UserCheck } from 'lucide-react';

const AssignDuties = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [duties, setDuties] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const [usersRes, dutiesRes, deptRes, ayRes] = await Promise.all([
                API.get('/admin/users'),
                API.get('/admin/duties'),
                API.get('/admin/departments'),
                API.get('/admin/academic-years')
            ]);
            setAllUsers(usersRes.data || []);
            setDuties(dutiesRes.data || []);
            setDepartments(deptRes.data || []);
            setAcademicYears(ayRes.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAssignDuty = async (userId, dutyId) => {
        if (!dutyId) return;
        try {
            await API.post('/admin/assign-duty', { user_id: userId, duty_id: dutyId });
            alert('Duty assigned successfully');
            fetchResources();
        } catch (err) {
            alert('Assignment failure: ' + (err.response?.data?.message || 'Error'));
        }
    };

    const handleQuickAssignTutor = async (userId, deptId, ayId) => {
        if (!deptId || !ayId) return;
        try {
            await API.post('/admin/assign-tutor', { user_id: userId, department_id: deptId, academic_year_id: ayId });
            alert('Tutor assigned successfully');
            fetchResources();
        } catch (err) {
            alert('Assignment failure: ' + (err.response?.data?.message || 'Error'));
        }
    };

    const handleUnassignDuty = async (userId, dutyId) => {
        if (!window.confirm('Remove this duty from faculty?')) return;
        try {
            await API.post('/admin/unassign-duty', { user_id: userId, duty_id: dutyId });
            fetchResources();
        } catch (err) {
            alert('Failed to unassign');
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                        <UserCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Assign Duties</h1>
                        <p className="text-slate-400 text-sm mt-1">Map staff members to clearing categories</p>
                    </div>
                </div>

                <div className="lg:col-span-12 space-y-8">
                    {/* Faculty Assignment List */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                <ShieldCheck size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Faculty Duty Assignment</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="py-4 px-4 font-semibold">Faculty Member</th>
                                        <th className="py-4 px-4 font-semibold">Assigned Duties</th>
                                        <th className="py-4 px-4 font-semibold">Assign New Duty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.filter(u => u.role === 'teacher' || u.role === 'both').map(user => (
                                        <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                            <td className="py-4 px-4 focus:outline-none">
                                                <div className="text-white font-medium">{user.username}</div>
                                                <div className="text-slate-500 text-xs">{user.email}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.assigned_duties?.map(d => (
                                                        <button 
                                                            key={d.id} 
                                                            onClick={() => handleUnassignDuty(user.id, d.id)}
                                                            className="group px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md text-xs border border-blue-500/20 flex items-center gap-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
                                                        >
                                                            {d.name}
                                                            <Trash2 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </button>
                                                    )) || <span className="text-slate-600 italic">None</span>}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <select 
                                                    className="bg-slate-950 border border-slate-800 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                                                    onChange={(e) => handleQuickAssignDuty(user.id, e.target.value)}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Choose Duty...</option>
                                                    {duties.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tutor Assignment List */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                                <BookOpen size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Tutor Department Assignment</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="py-4 px-4 font-semibold">Tutor Name</th>
                                        <th className="py-4 px-4 font-semibold">Current Batch</th>
                                        <th className="py-4 px-4 font-semibold">Reassign Batch</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.filter(u => u.role === 'tutor' || u.role === 'both').map(user => (
                                        <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="text-white font-medium">{user.username}</div>
                                                <div className="text-slate-500 text-xs">{user.email}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                {user.tutor_assignment ? (
                                                    <div className="text-purple-400 text-xs font-semibold">
                                                        {user.tutor_assignment.department_name} ({user.tutor_assignment.year_range})
                                                    </div>
                                                ) : <span className="text-slate-600 italic">None</span>}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <select 
                                                        className="bg-slate-950 border border-slate-800 text-white text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                                                        id={`dept-${user.id}`}
                                                    >
                                                        <option value="">Dept...</option>
                                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                    </select>
                                                    <select 
                                                        className="bg-slate-950 border border-slate-800 text-white text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                                                        id={`ay-${user.id}`}
                                                    >
                                                        <option value="">Year...</option>
                                                        {academicYears.map(y => <option key={y.id} value={y.id}>{y.year_range}</option>)}
                                                    </select>
                                                    <button 
                                                        onClick={() => {
                                                            const deptId = document.getElementById(`dept-${user.id}`).value;
                                                            const ayId = document.getElementById(`ay-${user.id}`).value;
                                                            handleQuickAssignTutor(user.id, deptId, ayId);
                                                        }}
                                                        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
                                                    >
                                                        <ArrowRight size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignDuties;
