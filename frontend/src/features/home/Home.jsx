import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import DesktopHeader from '../../components/DesktopHeader';
import MobileHeader from '../../components/MobileHeader';
import MobileNav from '../../components/MobileNav';
import FeaturedCard from '../../components/FeaturedCard';
import FeedCard from '../../components/FeedCard';
import CalendarWidget from '../../components/CalendarWidget';
import api from '../../services/api';
import useDebounce from '../../hooks/useDebounce';
import { Search } from 'lucide-react';

const Home = () => {
    const [feedData, setFeedData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);

    const fetchDog = async (search = '') => {
        try {
            const endpoint = search ? `/dogs/feed?search=${encodeURIComponent(search)}` : '/dogs/feed';
            const response = await api.get(endpoint);
            // Laravel's paginate() nests the actual array inside a sub-'data' key
            const fetchedDogs = Array.isArray(response.data.data.data)
                ? response.data.data.data
                : (Array.isArray(response.data.data) ? response.data.data : []);
            setFeedData(fetchedDogs);
        } catch (error) {
            console.error("Failed to fetch feed:", error);
            setFeedData([]);
        }
    }

    useEffect(() => {
        fetchDog(debouncedSearch);
    }, [debouncedSearch]);
    return (
        <div className="min-h-screen bg-[#f8f9fb] flex">
            {/* --- WEB SIDEBAR (Hidden on mobile) --- */}
            <Sidebar />

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Desktop Top Header */}
                <DesktopHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {/* Mobile Header (Hidden on desktop) */}
                <MobileHeader />

                {/* Dashboard Grid */}
                <div className="p-6 lg:p-10 flex flex-col gap-10">

                    {/* Top Section: Featured & Calendar */}
                    <div className="flex flex-col xl:flex-row gap-8 w-full">
                        <div className="flex-1 min-w-0 flex flex-col">
                            {/* Featured Web Card */}
                            <FeaturedCard />
                        </div>
                        <div className="hidden xl:block w-[320px] shrink-0 self-start">
                            {/* Calendar Widget */}
                            <CalendarWidget />
                        </div>
                    </div>

                    {/* Bottom Section: Feed Grid */}
                    <div className="flex flex-col gap-6 w-full mt-2">
                        {/* Section Header */}
                        <div className="flex justify-between items-center px-2">
                            <h2 className="text-2xl font-bold text-gray-800">Recent Updates</h2>
                            <button className="text-[#f05189] font-bold text-sm hover:underline">View All</button>
                        </div>

                        {/* Feed Grid (3 Columns Max) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {feedData.length > 0 ? (
                                feedData.map((post) => (
                                    <FeedCard key={post.id} post={post} />
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No recent updates found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* --- MOBILE NAVIGATION (Hidden on desktop) --- */}
            <MobileNav />
        </div>
    );
};

export default Home;