import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CalendarWidget = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                if (response.data && response.data.data) {
                    // Take only up to 2 events as requested
                    const firstTwo = response.data.data.slice(0, 2);
                    
                    // Transform the data format for the UI cards
                    const formattedEvents = firstTwo.map(event => {
                        // Event model only has 'time' and 'created_at', no 'date'
                        const dateToParse = event.created_at || new Date().toISOString();
                        const evtDate = new Date(dateToParse);
                        
                        const month = !isNaN(evtDate) ? evtDate.toLocaleString('default', { month: 'short' }) : 'TBD';
                        const day = !isNaN(evtDate) ? evtDate.getDate() : '--';
                        const timeStr = event.time || 'TBD';

                        return {
                            month,
                            day,
                            title: event.title,
                            timeRange: timeStr
                        };
                    });
                    
                    setUpcomingEvents(formattedEvents);
                }
            } catch (error) {
                console.error("Failed to fetch events for calendar widget:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#f05189]" />
                    Upcoming Events
                </h3>
                <button className="text-xs font-bold text-[#f05189]">Feb 2024</button>
            </div>
            <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event, idx) => (
                        <div key={idx} className={`flex items-center gap-4 p-3 rounded-2xl transition-colors ${idx === 0 ? 'bg-pink-50 border border-pink-100' : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'}`}>
                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shadow-sm ${idx === 0 ? 'bg-white' : 'bg-white border border-gray-100'}`}>
                                <span className={`text-[10px] font-bold uppercase ${idx === 0 ? 'text-[#f05189]' : 'text-gray-400'}`}>{event.month}</span>
                                <span className="text-lg font-black text-gray-800 leading-none">{event.day}</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{event.title}</p>
                                <p className="text-[10px] font-medium text-gray-500 uppercase">{event.timeRange}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No upcoming events.</p>
                )}
            </div>
            <button onClick={() => navigate('/events')} className="w-full mt-6 py-3 border-2 border-[#f05189] text-[#f05189] font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-[#f05189] hover:text-white transition-all">
                View Full Calendar
            </button>
        </div>
    );
};

export default CalendarWidget;
