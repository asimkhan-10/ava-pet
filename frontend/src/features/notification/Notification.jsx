import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, MapPin } from 'lucide-react';
import api from '../../services/api';

import Sidebar from '../../components/Sidebar';
import DesktopHeader from '../../components/DesktopHeader';
import MobileNav from '../../components/MobileNav';

const NotificationHeader = () => {
    const navigate = useNavigate();
    return (
        <header className="lg:hidden bg-[#f05189] text-white flex items-center justify-between px-5 pt-10 pb-4 sticky top-0 z-40 shadow-md shrink-0 w-full">
            <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white/20 hover:bg-white/30 transition-colors border border-white/30 backdrop-blur-sm"
            >
                <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>
            <h1 className="text-center text-lg font-bold">Notification</h1>
            <div className="w-10" />
        </header>
    );
};

const NotificationItem = ({ notification, isRead }) => {
    const isEvent = notification.type === 'event';
    const Icon = isEvent ? Bell : MapPin;
    const navigate = useNavigate();

    const handleClick = () => {
        if (isEvent && notification.related_id) {
            navigate('/event-detail', { state: { eventId: notification.related_id } });
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`bg-white border text-left border-gray-100 rounded-3xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#f05189]/30 transition-all duration-300 flex items-center gap-5 cursor-pointer ${isRead ? 'opacity-50' : ''}`}
        >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#eec8d5]/40 rounded-[20px] shrink-0 flex items-center justify-center relative overflow-hidden">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#f05189] stroke-[2.5]" fill="#f05189" fillOpacity={isEvent ? 1 : 0} />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[16px] sm:text-[17px] text-gray-900 leading-tight mb-1">
                    {notification.title}
                </h3>
                <p className="text-[12px] sm:text-[13px] text-gray-400 font-medium leading-relaxed truncate">
                    {notification.description || notification.message}
                </p>
            </div>
        </div>
    );
};

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAllRead, setIsAllRead] = useState(false);

    const handleMarkAllAsRead = async () => {
        try {
            await api.post('/notifications/read');
            setIsAllRead(true);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get('/notifications');
                if (response.data && response.data.success) {
                    setNotifications(response.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="h-screen bg-[#f8f9fb] flex overflow-hidden">
            {/* --- WEB SIDEBAR --- */}
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Desktop Top Header */}
                <DesktopHeader />

                {/* Mobile Header */}
                <NotificationHeader />

                {/* Main Content area with custom scrolling */}
                <div className="flex-1 overflow-y-auto px-4 lg:px-10 py-6 lg:py-10 pb-32 lg:pb-10 flex flex-col items-center custom-scrollbar">

                    {/* Header for Web */}
                    <div className="w-full max-w-3xl flex items-center justify-between mb-8 hidden lg:flex">
                        <h1 className="text-3xl font-black text-gray-800 leading-tight tracking-tight">Notifications</h1>
                        <button 
                            onClick={handleMarkAllAsRead}
                            className="text-[#f05189] font-bold text-sm bg-pink-50 hover:bg-[#f05189] hover:text-white transition-colors px-4 py-2 rounded-xl border border-pink-100"
                        >
                            Mark all as read
                        </button>
                    </div>

                    <div className="w-full max-w-3xl">
                        {/* Section Grouping (e.g. Today) */}
                        <div className="mb-6">
                            <h2 className="text-[17px] sm:text-lg font-black text-gray-900 mb-4 px-1 tracking-tight">Today</h2>
                            <div className="space-y-3 sm:space-y-4">
                                {loading ? (
                                    <p className="text-gray-500 text-sm">Loading notifications...</p>
                                ) : notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <NotificationItem key={notif.id} notification={notif} isRead={isAllRead || notif.is_read} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No new notifications.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- MOBILE NAVIGATION --- */}
            <MobileNav />
        </div>
    );
};

export default Notification;