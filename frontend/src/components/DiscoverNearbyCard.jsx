import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const DiscoverNearbyCard = () => {
    const [nearbyCount, setNearbyCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNearby = async (lat, lng) => {
            try {
                // Fetching dogs within a 5 mile radius
                const response = await api.get(`/dogs/nearby?lat=${lat}&lng=${lng}&radius=5`);
                if (response.data && response.data.success) {
                    setNearbyCount(response.data.data.length);
                }
            } catch (error) {
                console.error("Failed to fetch nearby dogs:", error);
            } finally {
                setLoading(false);
            }
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchNearby(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("Geolocation blocked or failed. Using default location.", error);
                    fetchNearby(39.9526, -75.1652); // Default to a static coordinate (e.g. Philadelphia)
                }
            );
        } else {
            fetchNearby(39.9526, -75.1652);
        }
    }, []);

    return (
        <div className="bg-[#1a1a1a] rounded-[32px] p-8 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f05189] rounded-full opacity-20 blur-3xl" />
            <h3 className="font-bold text-xl mb-4 relative z-10">Discover Nearby Pets</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6 relative z-10">
                {loading ? (
                    "Scanning area..."
                ) : (
                    `There are ${nearbyCount} pets within 5 miles of you reported recently.`
                )}
            </p>
            <button onClick={() => navigate('/nearby')} className="w-full py-4 bg-[#f05189] rounded-2xl font-bold text-xs uppercase tracking-widest relative z-10 shadow-lg shadow-[#f05189]/40 active:scale-95 transition-transform flex items-center justify-center gap-2">
                Open Map
            </button>
        </div>
    );
};

export default DiscoverNearbyCard;
