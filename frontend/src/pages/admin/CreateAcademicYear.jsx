import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Calendar, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';

const CreateAcademicYear = () => {
    const [years, setYears] = useState([]);
    const [newYearRange, setNewYearRange] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = async () => {
        try {
            const res = await API.get('/admin/academic-years');
            setYears(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateYear = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await API.post('/admin/academic-years', { year_range: newYearRange });
            setNewYearRange('');
            fetchYears();
        } catch (err) {
            alert('Failed to create academic year');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Note: Backend doesn't have delete route for academic years yet, 
    // but we can add the UI button for consistency if needed later.

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617]">
            <div className="h-12 w-12 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Calendar size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Academic Year Creation</h1>
                        <p className="text-slate-400 text-sm mt-1">Manage batch durations and active academic periods</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mt-8">
                    <form onSubmit={handleCreateYear} className="flex flex-col sm:flex-row gap-4 mb-10">
                        <div className="flex-1 relative">
                            <input
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-600"
                                placeholder="Enter Year Range (e.g. 2023 - 2026)..."
                                value={newYearRange}
                                onChange={(e) => setNewYearRange(e.target.value)}
                                required
                            />
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-blue-600/20"
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Plus size={20} />
                            )}
                            Create Year Range
                        </button>
                    </form>

                    <div className="border-t border-slate-800/50 pt-8">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Clock size={20} className="text-blue-500" /> Existing Academic Years
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {years.map((year) => (
                                <div 
                                    key={year.id} 
                                    className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between group hover:border-blue-500/50 transition-all hover:bg-slate-900/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-500 font-bold group-hover:scale-110 transition-transform">
                                            {year.year_range.split('-')[0].trim().slice(-2)}
                                        </div>
                                        <div>
                                            <span className="text-white font-bold block">{year.year_range}</span>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <div className={`h-1.5 w-1.5 rounded-full ${year.is_active ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                                    {year.is_active ? 'System Active' : 'Archived'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {year.is_active && (
                                        <CheckCircle2 size={18} className="text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
                                    )}
                                </div>
                            ))}
                            
                            {years.length === 0 && (
                                <div className="col-span-full py-12 text-center bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl">
                                    <p className="text-slate-500 italic">No academic years recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAcademicYear;
