import { useState, useEffect } from 'react';
import API from '../../services/api';
import { PlusCircle, Plus, Edit2, Trash2 } from 'lucide-react';

const CreateDuty = () => {
    const [duties, setDuties] = useState([]);
    const [newDuty, setNewDuty] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDuties();
    }, []);

    const fetchDuties = async () => {
        try {
            const res = await API.get('/admin/duties');
            setDuties(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDuty = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/duties', { name: newDuty });
            setNewDuty('');
            fetchDuties();
        } catch (err) {
            alert('Failed to create duty');
        }
    };

    const handleDeleteDuty = async (id) => {
        if (!window.confirm('Are you sure you want to delete this duty? This will remove all associated student statuses.')) return;
        try {
            await API.delete(`/admin/duties/${id}`);
            fetchDuties();
        } catch (err) {
            alert('Failed to delete duty');
        }
    };

    const handleUpdateDuty = async (duty) => {
        const newName = prompt('Enter new duty name:', duty.name);
        if (!newName || newName === duty.name) return;
        try {
            await API.put(`/admin/duties/${duty.id}`, { name: newName });
            fetchDuties();
        } catch (err) {
            alert('Failed to update duty');
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <PlusCircle size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Duty Creation</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage clearance categories and obligations</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                    <form onSubmit={handleCreateDuty} className="flex gap-3 mb-8">
                        <input
                            className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 transition-colors"
                            placeholder="New Duty Name (e.g. Library, Physical Education)..."
                            value={newDuty}
                            onChange={(e) => setNewDuty(e.target.value)}
                            required
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0">
                            <Plus size={20} /> Add Duty
                        </button>
                    </form>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-800/50 pt-6">
                        {duties.map((duty) => (
                            <div key={duty.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-blue-600 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-blue-500 font-bold border border-slate-800 uppercase">
                                        {duty.name ? duty.name[0] : '?'}
                                    </div>
                                    <span className="text-white font-medium">{duty.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleUpdateDuty(duty)} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteDuty(duty.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDuty;
