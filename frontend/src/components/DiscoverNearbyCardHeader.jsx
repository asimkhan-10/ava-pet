import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const DiscoverNearbyCardHeader = () => {
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
        <div 
            onClick={() => navigate('/nearby')}
            className="flex items-center gap-3 bg-[#fdf2f5] border border-pink-100 px-4 py-2 rounded-2xl cursor-pointer hover:bg-pink-100/80 transition-all duration-300"
        >
            <div className="bg-[#f05189] text-white p-1.5 rounded-xl shadow-sm">
                <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800 leading-tight">Nearby Pets</span>
                <span className="text-[10px] font-medium text-[#f05189]">
                    {loading ? "Scanning..." : `${nearbyCount} within 5 miles`}
                </span>
            </div>
        </div>
    );
};

export default DiscoverNearbyCardHeader;
