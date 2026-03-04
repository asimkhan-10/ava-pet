import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Clock, Users, MapPin, Search } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import DesktopHeader from '../../components/DesktopHeader';
import MobileHeader from '../../components/MobileHeader';
import MobileNav from '../../components/MobileNav';
import api from '../../services/api';

// Normalize image URLs to handle both full URLs and relative paths like 'uploads/...'
const fixImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) {
        return url.replace('http://localhost:8000', 'http://127.0.0.1:8000');
    }
    // Prepend the backend URL for relative paths (e.g., 'uploads/...')
    return url.startsWith('/') ? `http://127.0.0.1:8000${url}` : `http://127.0.0.1:8000/${url}`;
};

const EventCard = ({ event }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate('/event-detail', { state: { eventId: event.id } })}
            className="bg-white border text-left border-gray-100/80 rounded-3xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-[#f05189]/30 transition-all duration-300 flex items-start gap-5 group cursor-pointer relative"
        >
            {/* Left Icon Block / Image Block */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-[20px] shrink-0 border border-gray-100 flex items-center justify-center shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-[#f05189]/5 group-hover:bg-[#f05189]/10 transition-colors"></div>
                {event.image_path ? (
                    <img
                        src={fixImageUrl(event.image_path)}
                        alt={event.title}
                        className="w-full h-full object-cover relative z-10"
                    />
                ) : (
                    <Map className="w-8 h-8 sm:w-10 sm:h-10 text-[#f05189] stroke-2 relative z-10 drop-shadow-sm" />
                )}
            </div>

            {/* Content Container */}
            <div className="flex-1 min-w-0 pr-12">
                {/* Title */}
                <h3 className="font-bold text-[17px] sm:text-[19px] text-gray-900 leading-tight truncate mb-1.5 pr-2">
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-[12px] sm:text-[13px] text-gray-500 leading-[1.6] line-clamp-2 md:line-clamp-3 mb-4 pr-2">
                    {event.description}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-6 text-[11px] sm:text-xs font-bold text-[#f05189]">
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-pink-50 flex items-center justify-center border border-pink-100">
                            <Users className="w-3.5 h-3.5" />
                        </div>
                        {event.interested_count || 0}
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500">
                        <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                            <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate max-w-[120px] sm:max-w-full font-medium">{event.location}</span>
                    </div>
                </div>
            </div>

            {/* Time (Absolute top right of the whole card) */}
            <span className="absolute top-5 right-5 text-[10px] sm:text-xs font-bold text-[#f05189] flex items-center gap-1.5 bg-pink-50 px-2.5 py-1.5 rounded-lg border border-pink-100/50">
                <Clock className="w-3.5 h-3.5" />
                {event.time}
            </span>
        </div>
    );
};

const Event = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                if (response.data && response.data.data) {
                    setEvents(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch events:", error);
                setEvents([]);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9fb] flex">
            {/* --- WEB SIDEBAR --- */}
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0">
                {/* Desktop Top Header */}
                <DesktopHeader />

                {/* Mobile Header (Using pink primary variant) */}
                <MobileHeader title="Events" variant="primary" />

                {/* Dashboard Grid */}
                <div className="p-4 lg:p-10 grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1 pb-32 lg:pb-10">

                    {/* Left Column: Events List */}
                    <div className="xl:col-span-7 flex flex-col gap-4 lg:gap-5">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No upcoming events.</p>
                        )}
                    </div>
                </div>
            </main>

            {/* --- MOBILE NAVIGATION --- */}
            <MobileNav />
        </div>
    );
};

export default Event;
