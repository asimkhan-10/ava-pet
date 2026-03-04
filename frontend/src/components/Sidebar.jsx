import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, Map as MapIcon, Bell, User, Settings, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
const SIDEBAR_LINKS = [
    { name: 'Home', icon: Home, path: '/home', active: true },
    { name: 'Nearby', icon: MapPin, path: '/nearby' },
    { name: 'Events', icon: MapIcon, path: '/events' },
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'Profile', icon: User, path: '/profile' },
];

export const LogoPlaceholder = () => (
    <div className="w-10 h-10 bg-[#fdf2f5] rounded-xl flex items-center justify-center border border-pink-100 shadow-sm">
        <img src={logo} alt="ava" className="w-full h-full object-cover rounded-xl" />
    </div>
);

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="hidden lg:flex w-72 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen p-6">
            <div className="flex items-center gap-3 mb-10 px-2 min-h-10">
                <LogoPlaceholder />
                <span className="text-2xl font-black text-gray-800 tracking-tight">AVA PETS</span>
            </div>

            <nav className="flex-1 space-y-2">
                {SIDEBAR_LINKS.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                        <button
                            key={link.name}
                            onClick={() => navigate(link.path)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-semibold ${isActive
                                ? 'bg-[#f05189] text-white shadow-lg shadow-[#f05189]/20'
                                : 'text-gray-400 hover:bg-pink-50 hover:text-[#f05189]'
                                }`}
                        >
                            <link.icon className="w-5 h-5" />
                            {link.name}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-50">
                <button onClick={() => navigate('/login')} className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 font-semibold hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
