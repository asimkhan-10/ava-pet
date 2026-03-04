import React from 'react';
import { Bell } from 'lucide-react';
import { LogoPlaceholder } from './Sidebar';
import { useNavigate } from 'react-router-dom';

const MobileHeader = ({ title = "Ava Pets", variant = "default" }) => {
    const isPrimary = variant === "primary";
    const navigate = useNavigate();
    return (
        <header className={`lg:hidden flex justify-between items-center px-6 pt-6 pb-2 sticky top-0 z-40 ${isPrimary ? "bg-[#f05189] text-white" : "bg-white text-gray-800"
            }`}>
            {isPrimary ? (
                <div className="w-10" /> /* Empty spacer to center title */
            ) : (
                <LogoPlaceholder />
            )}

            <h1 className={`text-xl font-bold ${isPrimary ? "text-white absolute left-1/2 -translate-x-1/2" : "text-lg text-gray-800"}`}>
                {title}
            </h1>

            <button className={`p-2 ${isPrimary ? "text-white" : "text-[#f05189]"}`}>
                <Bell className="w-6 h-6" onClick={() => navigate('/notifications')} />
            </button>
        </header>
    );
};

export default MobileHeader;
