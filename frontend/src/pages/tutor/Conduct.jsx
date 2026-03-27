import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { ArrowLeft, CheckCircle2, Save, FileText } from 'lucide-react';

const Conduct = () => {
    const { student_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        date_of_admission: '',
        total_working_days: '',
        days_attended: '',
        last_date_of_attendance: '',
        conduct_character: 'Good',
        mentor_recommendation: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmApprove = window.confirm("Are you sure you want to approve TC and save conduct details?");
        if (!confirmApprove) return;

        setLoading(true);
        try {
            await API.post('/tutor/conduct-and-approve', {
                student_id: student_id,
                ...formData
            });
            alert('Conduct details saved and student approved successfully');
            navigate('/tutor/verification');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit conduct details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                    <button
                        onClick={() => navigate('/tutor/verification')}
                        className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex-shrink-0"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-blue-500 font-semibold text-sm">Clearance Approval</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Conduct & Attendance
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Please fill in the final student conduct and attendance details before granting final TC approval.
                        </p>
                    </div>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
                    
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                        <FileText className="text-blue-500" size={24} />
                        <h2 className="text-xl font-bold text-white">Student Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date of Admission */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Date of admission or promotion to the class</label>
                            <input
                                type="date"
                                name="date_of_admission"
                                required
                                value={formData.date_of_admission}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                            />
                        </div>

                        {/* Last date of attendance */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Last date of attendance</label>
                            <input
                                type="date"
                                name="last_date_of_attendance"
                                required
                                value={formData.last_date_of_attendance}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                            />
                        </div>

                        {/* Total No. of working hours/days up to the date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Total No. of working days up to the date</label>
                            <input
                                type="number"
                                name="total_working_days"
                                required
                                min="0"
                                placeholder="e.g. 180"
                                value={formData.total_working_days}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                            />
                        </div>

                        {/* Total No. of working hours/days attended */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Total No. of working days attended</label>
                            <input
                                type="number"
                                name="days_attended"
                                required
                                min="0"
                                placeholder="e.g. 165"
                                value={formData.days_attended}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                            />
                        </div>

                        {/* Conduct and character */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Conduct and character</label>
                            <select
                                name="conduct_character"
                                required
                                value={formData.conduct_character}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                            >
                                <option value="Excellent">Excellent</option>
                                <option value="Very Good">Very Good</option>
                                <option value="Good">Good</option>
                                <option value="Satisfactory">Satisfactory</option>
                                <option value="Needs Improvement">Needs Improvement</option>
                            </select>
                        </div>

                        {/* Recommendation of the mentor */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Recommendation of the mentor (Optional)</label>
                            <textarea
                                name="mentor_recommendation"
                                rows="3"
                                placeholder="Mentor's final remarks and recommendations..."
                                value={formData.mentor_recommendation}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/tutor/verification')}
                            className="px-6 py-3 rounded-xl font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-blue-600/50"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle2 size={18} />
                                    <span>Submit & Approve Certificate</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Conduct;
