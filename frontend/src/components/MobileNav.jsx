import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, MapPin, Plus, Map as MapIcon, User } from 'lucide-react';

const MobileNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getNavClass = (path) => {
        const isActive = location.pathname.startsWith(path);
        return isActive ? 'text-[#f05189]' : 'text-gray-400';
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-white/90 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] px-8 py-5 z-50 flex justify-between items-center lg:hidden">
            <button onClick={() => navigate('/home')} className={`flex flex-col items-center gap-1 group relative ${getNavClass('/home')}`}>
                <HomeIcon className="w-6 h-6" />
                {location.pathname.startsWith('/home') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#f05189] rounded-full" />}
            </button>
            <button onClick={() => navigate('/nearby')} className={`flex flex-col items-center gap-1 group relative ${getNavClass('/nearby')}`}>
                <MapPin className="w-6 h-6" />
                {location.pathname.startsWith('/nearby') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#f05189] rounded-full" />}
            </button>
            <div className="relative -mt-16">
                <button onClick={() => navigate('/add-missing-post')} className="bg-[#f05189] p-5 rounded-full shadow-lg text-white border-4 border-white">
                    <Plus className="w-7 h-7 stroke-[3px]" />
                </button>
            </div>
            <button onClick={() => navigate('/events')} className={`flex flex-col items-center gap-1 group relative ${getNavClass('/events')}`}>
                <MapIcon className="w-6 h-6" />
                {location.pathname.startsWith('/events') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#f05189] rounded-full" />}
            </button>
            <button onClick={() => navigate('/profile')} className={`flex flex-col items-center gap-1 group relative ${getNavClass('/profile')}`}>
                <User className="w-6 h-6" />
                {location.pathname.startsWith('/profile') && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#f05189] rounded-full" />}
            </button>
        </div>
    );
};

export default MobileNav;
