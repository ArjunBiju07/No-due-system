import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Users, Edit2, Trash2 } from 'lucide-react';

const ManageUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get('/admin/users');
            setAllUsers(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Permanently delete this user? All assignments will be lost.')) return;
        try {
            await API.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEditUser = async (user) => {
        const newName = prompt('Enter new full name:', user.username);
        const newEmail = prompt('Enter new email address:', user.email);
        const newRole = prompt('Enter new role (teacher/tutor/both/admin):', user.role);

        if (!newName || !newEmail || !newRole) return;
        
        try {
            await API.put(`/admin/users/${user.id}`, { 
                username: newName, 
                email: newEmail, 
                role: newRole 
            });
            fetchUsers();
        } catch (err) {
            alert('Update failed');
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">System User Management</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage all administrative and faculty accounts</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="py-4 px-4 font-semibold">Username</th>
                                    <th className="py-4 px-4 font-semibold">Email</th>
                                    <th className="py-4 px-4 font-semibold">Role</th>
                                    <th className="py-4 px-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map((u) => (
                                    <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="text-white font-medium">{u.username}</div>
                                        </td>
                                        <td className="py-4 px-4 text-slate-400 text-sm">
                                            {u.email}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                                u.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                u.role === 'teacher' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                u.role === 'tutor' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                                                'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button 
                                                    onClick={() => handleEditUser(u)}
                                                    className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
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
    );
};

export default ManageUsers;
