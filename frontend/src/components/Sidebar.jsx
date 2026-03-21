import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    LogOut,
    FileText,
    ClipboardList,
    AlertTriangle,
    Building2,
    UserPlus,
    PlusCircle,
    UserCheck,
    CheckSquare,
    X,
    AppWindow,
    CalendarDays
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const navItems = {
        admin: [
            { icon: LayoutDashboard, label: 'Home', path: '/admin' },
            { icon: UserPlus, label: 'User Creation', path: '/admin/create-user' },
            { icon: Building2, label: 'Department Creation', path: '/admin/create-dept' },
            { icon: CalendarDays, label: 'Academic Year Creation', path: '/admin/create-year' },
            { icon: PlusCircle, label: 'Duty Creation', path: '/admin/create-duty' },
            { icon: UserCheck, label: 'Assign Duties', path: '/admin/assign-duties' },
            { icon: Users, label: 'Manage user', path: '/admin/manage-users' },
        ],
        teacher: [
            { icon: LayoutDashboard, label: 'Home', path: '/teacher' },
            { icon: AlertTriangle, label: 'Set Dues', path: '/teacher/set-dues' },
            { icon: ClipboardList, label: 'Show Dues', path: '/teacher/show-dues' },
        ],
        tutor: [
            { icon: LayoutDashboard, label: 'Home', path: '/tutor' },
            { icon: ShieldCheck, label: 'Request Verification', path: '/tutor/verification' },
            { icon: AlertTriangle, label: 'Course Drop Approvals', path: '/tutor/year-drops' },
            { icon: CheckSquare, label: 'Approved Students', path: '/tutor/approved' },
        ],
        both: [
            { icon: LayoutDashboard, label: 'Home', path: '/teacher' },
            { icon: ShieldCheck, label: 'Request Verification', path: '/tutor/verification' },
            { icon: AlertTriangle, label: 'Course Drop Approvals', path: '/tutor/year-drops' },
            { icon: CheckSquare, label: 'Approved Students', path: '/tutor/approved' },
            { icon: AlertTriangle, label: 'Set Dues', path: '/teacher/set-dues' },
            { icon: ClipboardList, label: 'Show Dues', path: '/teacher/show-dues' },
        ],
        student: [
            { icon: LayoutDashboard, label: 'Home', path: '/student' },
            { icon: FileText, label: 'My Status', path: '/student/status' },
            { icon: AlertTriangle, label: 'Course Drop', path: '/student/year-drop' },
        ]
    };

    const currentNavItems = navItems[user.role] || [];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-[100dvh] w-72 bg-[#020617] lg:bg-slate-900 border-r border-slate-800 z-[60] flex flex-col flex-shrink-0 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${!user ? 'hidden' : 'flex'}`}
            >
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Brand Container */}
                    <div className="flex items-center justify-between mb-12">
                        <Link
                            to="/"
                            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                            className="flex items-center gap-4"
                        >
                            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                                <AppWindow size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold tracking-widest text-white leading-none">NO DUE</span>
                                <span className="text-xs font-medium text-slate-400 mt-1 capitalize">{user.role} Panel</span>
                            </div>
                        </Link>

                        <button
                            onClick={onClose}
                            className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1">
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu</p>
                        {currentNavItems.map((item, idx) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={idx}
                                    to={item.path}
                                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors ${isActive ? 'bg-blue-600/10 text-blue-500 font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                                >
                                    <item.icon size={18} className={isActive ? 'text-blue-500' : 'text-slate-400'} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-sm">{item.label}</span>
                                    
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Section */}
                <div className="mt-auto p-6 border-t border-slate-800">
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
