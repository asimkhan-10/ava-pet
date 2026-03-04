import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, MapPin, UserCheck, UserX, UserPlus, Map } from 'lucide-react';
import api from '../../services/api';

import Sidebar from '../../components/Sidebar';
import DesktopHeader from '../../components/DesktopHeader';
import MobileNav from '../../components/MobileNav';

// Normalize image URLs to handle both full URLs and relative paths like 'uploads/...'
const fixImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) {
        return url.replace('http://localhost:8000', 'http://127.0.0.1:8000');
    }
    // Prepend the backend URL for relative paths (e.g., 'uploads/...')
    return url.startsWith('/') ? `http://127.0.0.1:8000${url}` : `http://127.0.0.1:8000/${url}`;
};

const EventDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const eventId = location.state?.eventId;

    const [eventDetail, setEventDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!eventId) {
            setError('Event not found.');
            setLoading(false);
            return;
        }

        const fetchEventDetail = async () => {
            try {
                const response = await api.get(`/events/${eventId}`);
                if (response.data && response.data.data) {
                    setEventDetail(response.data.data);
                } else {
                    setError('Event details could not be loaded.');
                }
            } catch (err) {
                console.error("Error fetching event details:", err);
                setError('Failed to fetch event details.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetail();
    }, [eventId]);

    const handleInterested = async () => {
        if (!eventId || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await api.post(`/events/${eventId}/interested`);
            if (response.data && response.data.success) {
                // Update local state to reflect the new count
                setEventDetail(prev => ({
                    ...prev,
                    interested_count: prev.interested_count + 1
                }));
            } else {
                alert(response.data.message || "Could not mark as interested.");
            }
        } catch (err) {
            console.error("Error marking interested:", err);
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to update interest status.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen bg-[#f8f9fb] flex overflow-hidden">
            {/* --- WEB SIDEBAR --- */}
            <Sidebar />

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
                {/* Desktop Top Header */}
                <DesktopHeader />

                {/* Mobile Header (Hidden on Web) */}
                <header className="lg:hidden bg-[#f05189] text-white flex items-center justify-between px-5 pt-10 pb-4 sticky top-0 z-50 shadow-md shrink-0 w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white/20 hover:bg-white/30 transition-colors border border-white/30 backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                    <h1 className="text-center text-lg font-bold">Events Detail</h1>
                    <div className="w-10" />
                </header>

                {/* Page Content Container (Scrollable internally hide scrollbar) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden w-full px-0 lg:px-10 lg:py-8 pb-[100px] lg:pb-0 flex flex-col items-center custom-scrollbar">

                    {/* Web Header Overlay (Desktop) */}
                    <div className="w-full max-w-6xl flex items-center justify-between mb-6 hidden lg:flex shrink-0">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2.5 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-[#f05189] transition-all shadow-sm group"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div>
                                <h1 className="text-xl font-black text-gray-800 leading-tight">Events Detail</h1>
                                <p className="text-gray-400 font-medium text-[10px]">Everything you need to know about this event.</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pb-20 lg:pb-10 min-h-0 lg:flex-1">

                        {eventDetail ? (
                            <>
                                {/* LEFT COLUMN: Image Section */}
                                <div className="lg:col-span-5 h-full">
                                    <div className="bg-transparent lg:bg-white lg:rounded-[32px] lg:p-6 lg:shadow-sm lg:border border-gray-100 h-full flex flex-col">
                                        {/* Image/Icon Section matching mobile design */}
                                        <div className="p-8 lg:p-0 flex-1 flex flex-col items-center justify-center">
                                            <div className="relative w-48 h-48 lg:w-full lg:aspect-square max-w-[300px] lg:max-w-none bg-white lg:bg-[#fdf2f5]/30 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] lg:shadow-none lg:border-2 lg:border-dashed lg:border-pink-100 flex items-center justify-center overflow-hidden group">
                                                {/* Faux background elements on desktop */}
                                                <div className="absolute inset-0 bg-[#f05189]/5 group-hover:bg-[#f05189]/10 transition-colors hidden lg:block"></div>
                                                {eventDetail.image_path ? (
                                                    <img
                                                        src={fixImageUrl(eventDetail.image_path)}
                                                        alt={eventDetail.title}
                                                        className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <Map className="w-24 h-24 lg:w-40 lg:h-40 text-[#f05189] stroke-[1.5] relative z-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-500" />
                                                )}
                                            </div>
                                            <h2 className="text-2xl font-black text-gray-900 mt-8 tracking-tight lg:hidden">{eventDetail.title}</h2>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Details Section */}
                                <div className="lg:col-span-7 bg-white lg:rounded-[32px] lg:p-8 shrink-0 lg:shadow-sm lg:border border-gray-100 flex flex-col h-full lg:overflow-y-auto">

                                    <div className="px-6 lg:px-0 lg:pt-1 space-y-6 lg:space-y-8">

                                        {/* Desktop Title */}
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight hidden lg:block">{eventDetail.title}</h2>

                                        {/* Location Row */}
                                        <div className="flex items-center gap-2">
                                            <div className="text-[#f05189] flex items-center justify-center w-6 h-6 shrink-0 text-opacity-80">
                                                <MapPin className="w-6 h-6 stroke-2" />
                                            </div>
                                            <p className="text-gray-800 font-bold text-sm leading-relaxed">
                                                {eventDetail.location}
                                            </p>
                                        </div>

                                        {/* Interest Stats Block */}
                                        <div className="space-y-2">
                                            {/* Interested */}
                                            <div className="flex items-center gap-4">
                                                <div className="text-[#f05189] flex items-center justify-center w-6 h-6 shrink-0 text-opacity-80">
                                                    <UserPlus className="w-5 h-5 stroke-[2.5]" />
                                                </div>
                                                <p className="text-gray-800 font-bold text-sm">
                                                    {eventDetail.interested_count || 0} <span className="text-[#f05189] font-semibold text-[13px] ml-1 opacity-90">(People are interested)</span>
                                                </p>
                                            </div>


                                        </div>

                                        {/* Description Block */}
                                        <div className="pt-4 lg:pt-1">
                                            <h2 className="text-[17px] font-black text-gray-800 mb-3 tracking-tight">Description</h2>
                                            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 lg:bg-transparent lg:p-0 lg:border-none lg:rounded-none">
                                                <p className="text-gray-500 font-medium text-sm leading-[1.8]">
                                                    {eventDetail.description}
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="mt-8 lg:mt-auto hidden lg:flex pt-6">
                                        <button
                                            onClick={handleInterested}
                                            disabled={isSubmitting}
                                            className={`w-full bg-[#f05189] text-white rounded-xl py-4 font-black shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-[10px] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                            {isSubmitting ? 'Updating...' : 'Interested'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : error ? (
                            <div className="col-span-12 flex justify-center py-20">
                                <p className="text-red-500 text-sm font-medium">{error}</p>
                            </div>
                        ) : (
                            <div className="col-span-12 flex justify-center py-20">
                                <p className="text-gray-500 text-sm">Loading event details...</p>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* --- MOBILE NAVIGATION --- */}
            <MobileNav />
        </div>
    );
};

export default EventDetail;
