import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Dog } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import DesktopHeader from '../../components/DesktopHeader';
import MobileNav from '../../components/MobileNav';
import api from '../../services/api';

const MissingDog = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [missingDog, setMissingDog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchDogDetails = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/dogs/${id}`);
                // Since dogs is inside 'data' key often (from single resource)
                if (response.data && response.data.data) {
                    setMissingDog(response.data.data);
                } else if (response.data) {
                    setMissingDog(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch dog details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDogDetails();
    }, [id]);

    // Handle Image Array Resolution properly
    let imageArray = [];
    if (missingDog) {
        if (missingDog.images && Array.isArray(missingDog.images)) {
            imageArray = missingDog.images;
        } else if (missingDog.image) {
            imageArray = [missingDog.image];
        } else if (typeof missingDog.images === 'string') {
            try {
                const parsed = JSON.parse(missingDog.images);
                if (Array.isArray(parsed)) imageArray = parsed;
                else if (missingDog.images) imageArray = [missingDog.images];
            } catch (e) {
                if (missingDog.images) imageArray = [missingDog.images];
            }
        }
        
        // Fallback placeholder if entirely missing
        if (imageArray.length === 0) {
            imageArray = ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200"];
        }

        // Normalize URLs
        imageArray = imageArray.map(img => {
            if (!img) return null;
            if (img.startsWith('http://localhost:8000')) {
                return img.replace('http://localhost:8000', 'http://127.0.0.1:8000');
            } else if (img.startsWith('/')) {
                return 'http://127.0.0.1:8000' + img;
            }
            return img;
        }).filter(Boolean);
    }

    const nextImage = () => {
        if (imageArray.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % imageArray.length);
        }
    };

    const prevImage = () => {
        if (imageArray.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
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
                    <h1 className="text-center text-lg font-bold">Missing dog nearby you!</h1>
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
                                <h1 className="text-xl font-black text-gray-800 leading-tight">Missing dog nearby you!</h1>
                                <p className="text-gray-400 font-medium text-[10px]">Help reunite this pet with its owner.</p>
                            </div>
                        </div>

                        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center border border-pink-100 shadow-sm shrink-0">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f05189] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f05189]"></span>
                            </span>
                        </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pb-20 lg:pb-10 min-h-0 lg:flex-1">

                        {missingDog ? (
                            <>
                                {/* LEFT COLUMN: Image Section */}
                                <div className="lg:col-span-5 h-full">
                                    <div className="bg-transparent lg:bg-white lg:rounded-[32px] lg:p-6 lg:shadow-sm lg:border border-gray-100 h-full flex flex-col">
                                        {/* Image Section */}
                                        <div className="p-5 lg:p-0 flex-1 flex flex-col">
                                            <div className="relative w-full aspect-[4/3] lg:aspect-square lg:flex-1 lg:max-h-none rounded-2xl lg:rounded-[2rem] border-[1.5px] border-[#f05189]/30 overflow-hidden shadow-sm p-1 group">
                                                <img
                                                    src={imageArray[currentImageIndex] || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200"}
                                                    alt={missingDog.name || "Missing pet"}
                                                    className="w-full h-full object-cover rounded-xl lg:rounded-[1.7rem]"
                                                />
                                                
                                                {/* Overlay Nav Chevrons */}
                                                {imageArray.length > 1 && (
                                                    <>
                                                        <button 
                                                            onClick={prevImage}
                                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 hover:bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-[#f05189] transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                                                        </button>
                                                        <button 
                                                            onClick={nextImage}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 hover:bg-white/90 backdrop-blur shadow-md rounded-full flex items-center justify-center text-[#f05189] transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <ChevronRight className="w-6 h-6" strokeWidth={3} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            {/* Pagination Dots */}
                                            {imageArray.length > 1 && (
                                                <div className="flex justify-center items-center gap-2.5 mt-5 shrink-0">
                                                    {imageArray.map((_, idx) => (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => setCurrentImageIndex(idx)}
                                                            className={`h-[7px] rounded-full transition-all ${currentImageIndex === idx ? 'w-5 bg-[#f05189]' : 'w-[7px] bg-pink-200 hover:bg-pink-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Details Section */}
                                <div className="lg:col-span-7 bg-white lg:rounded-[32px] lg:p-8 shrink-0 lg:shadow-sm lg:border border-gray-100 flex flex-col h-full lg:overflow-y">

                                    <div className="px-6 lg:px-0 space-y-8 lg:space-y-8">
                                        {/* Name Row */}
                                        <div className="flex items-start">
                                            <div className="flex-1">
                                                <h2 className="text-base font-black text-gray-800 mb-1 tracking-tight">Name</h2>
                                                <p className="text-gray-500 font-medium text-sm">{missingDog.name}</p>
                                            </div>
                                            <div className="text-[#f05189] flex items-center justify-center bg-pink-50 w-12 h-12 rounded-2xl border border-pink-100 shrink-0">
                                                <Dog className="w-5 h-5 fill-current opacity-90" strokeWidth={1.5} />
                                            </div>
                                        </div>

                                        {/* Location View */}
                                        <div className="flex items-start">
                                            <div className="flex-1 pr-10">
                                                <h2 className="text-base font-black text-gray-800 mb-1 tracking-tight">Location</h2>
                                                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                                    {missingDog.last_location || missingDog.location || "Location not provided"}
                                                </p>
                                            </div>
                                            <div className="text-[#f05189] flex items-center justify-center bg-pink-50 w-12 h-12 rounded-2xl border border-pink-100 shrink-0">
                                                <MapPin className="w-5 h-5" strokeWidth={2.5} />
                                            </div>
                                        </div>

                                        {/* Description Block */}
                                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                            <h2 className="text-base font-black text-gray-800 mb-2 tracking-tight">Description</h2>
                                            <p className="text-gray-500 font-medium text-sm leading-loose">
                                                {missingDog.description || "No description provided."}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="col-span-12 flex flex-col justify-center items-center py-32 opacity-70">
                                <Dog className="w-10 h-10 text-gray-300 mb-4 animate-bounce" />
                                <p className="text-gray-400 text-base font-bold tracking-widest uppercase">{loading ? "Loading Details..." : "Pet Not Found"}</p>
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

export default MissingDog;