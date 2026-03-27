import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className={`fixed top-0 right-0 z-50 bg-[#020617] border-b border-slate-800 transition-all ${user ? 'left-0 lg:left-72' : 'left-0'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* Left side: Mobile Menu Toggle */}
                <div className="flex-1 flex items-center justify-start">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-slate-400 hover:text-white"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Center: Brand Title */}
                <div className="flex-shrink-0 flex items-center justify-center">
                    <Link to="/" className="text-2xl font-bold text-white tracking-widest">
                        NO DUE
                    </Link>
                </div>

                {/* Right side: Links and Profile */}
                <div className="flex-1 flex items-center justify-end gap-6">
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Home
                        </Link>
                    </div>
                    
                    {/* User Profile Dropdown */}
                    <div className="group relative">
                        <button className="flex items-center gap-2 p-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors shadow-sm focus:outline-none">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                <User size={16} />
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-white px-2">
                                {user.username.split(' ')[0]}
                            </span>
                        </button>

                        <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl mt-1">
                                <div className="px-4 py-3 border-b border-slate-800">
                                    <p className="text-xs text-slate-400 mb-1">Signed in as</p>
                                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 text-left transition-colors"
                                >
                                    <LogOut size={16} />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
