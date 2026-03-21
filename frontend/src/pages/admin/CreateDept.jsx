import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Building2, Plus, Trash2 } from 'lucide-react';

const CreateDept = () => {
    const [departments, setDepartments] = useState([]);
    const [newDeptName, setNewDeptName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await API.get('/admin/departments');
            setDepartments(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDept = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/departments', { name: newDeptName });
            setNewDeptName('');
            fetchDepartments();
        } catch (err) {
            alert('Failed to create department');
        }
    };

    const handleDeleteDept = async (id) => {
        if (!window.confirm('Delete this academic department?')) return;
        try {
            await API.delete(`/admin/departments/${id}`);
            fetchDepartments();
        } catch (err) {
            alert('Failed to delete department');
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                        <Building2 size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Department Creation</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage academic branches and divisions</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mt-8">
                    <form onSubmit={handleCreateDept} className="flex gap-3 mb-8">
                        <input
                            className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors"
                            placeholder="Enter Academic Department Name (e.g. Computer Science)..."
                            value={newDeptName}
                            onChange={(e) => setNewDeptName(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0">
                            <Plus size={20} /> Create Dept
                        </button>
                    </form>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-800/50 pt-6">
                        {departments.map((dept) => (
                            <div key={dept.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-orange-600 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-orange-500 font-bold border border-slate-800 uppercase">
                                        {dept.name ? dept.name[0] : '?'}
                                    </div>
                                    <span className="text-white font-medium">{dept.name}</span>
                                </div>
                                <button onClick={() => handleDeleteDept(dept.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDept;
