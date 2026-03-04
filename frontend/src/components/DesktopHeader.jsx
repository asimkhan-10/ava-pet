import React, { useState, useEffect } from 'react';
import { Search, Flame, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DiscoverNearbyCardHeader from './DiscoverNearbyCardHeader';

const fixImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) {
        return url.replace('http://localhost:8000', 'http://127.0.0.1:8000');
    }
    return url.startsWith('/') ? `http://127.0.0.1:8000${url}` : `http://127.0.0.1:8000/${url}`;
};

const DesktopHeader = ({ searchQuery = '', setSearchQuery = () => {} }) => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState({
        name: 'User',
        location: 'Location not set',
        profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                if (response.data && response.data.success) {
                    const data = response.data.data;
                    let displayName = data.name;
                    if (!displayName && data.first_name) {
                        displayName = `${data.first_name} ${data.last_name || ''}`.trim();
                    }
                    
                    setUserProfile({
                        name: displayName || 'User',
                        location: data.location || 'Location not set',
                        profile_image: data.profile_image ? fixImageUrl(data.profile_image) : ''
                    });
                }
            } catch (error) {
                console.error('Failed to load profile for header:', error);
            }
        };
        fetchProfile();
    }, []);

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-50 px-8 py-4 hidden lg:flex items-center justify-between">
            <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search playdates, events, or dogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#f05189]/20 transition-all outline-none text-sm"
                />
            </div>

            <div className="flex items-center gap-6">
                <DiscoverNearbyCardHeader />
                <div className="flex gap-2">
                    <button onClick={() => navigate('/add-missing-post')} className="p-2.5 rounded-xl text-[#f05189] bg-pink-50 border border-pink-100 hover:bg-[#f05189] hover:text-white transition-colors duration-300">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="h-8 w-[1px] bg-gray-100" />
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-800 leading-none">{userProfile.name}</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase">{userProfile.location}</p>
                    </div>
                   <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
    {userProfile.profile_image ? (
        <img
            src={userProfile.profile_image}
            alt="Avatar"
            className="w-full h-full object-cover"
        />
    ) : null}
</div>
                </div>
            </div>
        </header>
    );
};

export default DesktopHeader;
