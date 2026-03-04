import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Camera, Info, CheckCircle2, MapPin, X } from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import DesktopHeader from '../../components/DesktopHeader';
import MobileNav from '../../components/MobileNav';
import api from '../../services/api';

const AddMissingPost = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]); // File objects
    const [imagePreviews, setImagePreviews] = useState([]); // Base64 preview urls
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        last_location: '',
        description: '',
        latitude: '39.9526', // Mock default coords (Philly)
        longitude: '-75.1652',
    });

    // Capture the user's REAL physical location to sync with the Nearby Radar!
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                },
                (error) => console.warn("Geolocation blocked/failed for AddPost. Using default location.")
            );
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Add to file state
        setImages((prev) => [...prev, ...files].slice(0, 4)); // Max 4 images

        // Create previews
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
    };

    const removeImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
        setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            alert('Please upload at least one photo of the missing pet.');
            return;
        }

        setLoading(true);

        try {
            // Attempt to geocode the text address the user typed into actual GPS coordinates (Free OpenStreetMap API)
            let finalLat = formData.latitude;
            let finalLng = formData.longitude;

            try {
                if (formData.last_location) {
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.last_location)}&limit=1`);
                    const geoData = await geoRes.json();
                    if (geoData && geoData.length > 0) {
                        finalLat = geoData[0].lat;
                        finalLng = geoData[0].lon;
                    }
                }
            } catch (geoErr) {
                console.warn("Geocoding failed, falling back to device location.", geoErr);
            }

            // Because we are sending files, we MUST use FormData instead of a standard JSON object.
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('last_location', formData.last_location);
            submitData.append('description', formData.description);
            submitData.append('latitude', finalLat);
            submitData.append('longitude', finalLng);

            // Append multiple images
            images.forEach((image) => {
                submitData.append('images[]', image);
            });

            // Make the authenticated request
            const response = await api.post('/dogs/missing', submitData);

            if (response.data.success) {
                alert('Missing post published successfully!');
                navigate(-1); // Go back or to home
            }
        } catch (error) {
            console.error('Error submitting missing post:', error.response?.data || error.message);

            // Extract specific Laravel validation messages (like 2MB image max)
            if (error.response?.status === 422 && error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                alert(`Could not publish post due to the following errors:\n\n${errorMessages}`);
            } else {
                alert('Failed to publish missing post. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#f8f9fb] flex overflow-hidden">
            {/* --- WEB SIDEBAR --- */}
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Desktop Top Header */}
                <DesktopHeader />

                {/* Mobile Header (Hidden on Desktop) */}
                <header className="lg:hidden bg-[#f05189] text-white flex items-center px-5 pt-8 pb-4 sticky top-0 z-50 shadow-md">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="flex-1 text-center font-bold pr-10">Add Missing Post</h1>
                </header>

                {/* --- PAGE CONTENT --- */}
                <div className="flex-1 p-4 lg:p-6 flex flex-col items-center overflow-y-auto lg:overflow-hidden">

                    {/* Header for Web */}
                    <div className="w-full max-w-6xl flex items-center justify-between mb-4 hidden lg:flex">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2.5 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-[#f05189] transition-all shadow-sm group"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div>
                                <h1 className="text-xl font-black text-gray-800 leading-tight">Add Missing Post</h1>
                                <p className="text-gray-400 font-medium text-[10px]">Help the community find your pet by providing accurate details.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-green-500 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Draft Saved</span>
                        </div>
                    </div>

                    {/* Main Editor Grid */}
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pb-20 lg:pb-0 h-full">

                        {/* LEFT COLUMN: Media Upload */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-base font-bold text-gray-800">Pet Photos</h2>
                                    <span className="text-[10px] font-bold text-gray-400">{images.length} / 4 Photos</span>
                                </div>

                                {/* Main Dropzone Area */}
                                <label className="h-48 md:h-56 lg:h-48 xl:h-64 w-full rounded-[20px] border-2 border-dashed border-pink-100 bg-[#fdf2f5]/30 flex flex-col items-center justify-center p-4 text-center group hover:bg-[#fdf2f5]/50 transition-all cursor-pointer mb-3 relative overflow-hidden">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/jpg"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#f05189] shadow-md group-hover:scale-110 transition-transform mb-2">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <p className="font-bold text-gray-700 text-xs">Upload Pet Photo</p>
                                    <p className="text-[9px] text-gray-400 mt-0.5">JPEG, PNG up to 2MB</p>
                                </label>

                                {/* Thumbnail Slots */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="h-16 relative rounded-xl border border-pink-100 overflow-hidden group">
                                                <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="p-1 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors text-white"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Blank placeholders if less than 4 */}
                                        {[...Array(Math.max(0, 4 - imagePreviews.length))].map((_, i) => (
                                            <div key={`blank-${i}`} className="h-16 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-300">
                                                <Camera className="w-4 h-4" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4 p-3 bg-blue-50 rounded-xl flex gap-2.5 border border-blue-100">
                                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-[9px] text-blue-700 font-medium leading-relaxed">
                                        Clear photos help people identify your pet more easily.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Details Form */}
                        <div className="lg:col-span-7 bg-white rounded-[28px] p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col">
                            <h2 className="text-base font-bold text-gray-800 mb-4 border-b border-gray-50 pb-3">Information Details</h2>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Pet's Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Buddy"
                                        className="w-full bg-gray-50 border border-transparent focus:border-[#f05189] focus:bg-white rounded-xl py-3 px-5 outline-none transition-all font-bold text-gray-800 text-xs"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Known Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f05189] w-4 h-4" />
                                        <input
                                            type="text"
                                            name="last_location"
                                            value={formData.last_location}
                                            onChange={handleInputChange}
                                            placeholder="Enter address or landmark"
                                            className="w-full bg-gray-50 border border-transparent focus:border-[#f05189] focus:bg-white rounded-xl py-3 pl-11 pr-5 outline-none transition-all font-bold text-gray-800 text-xs"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe distinctive marks, collar color..."
                                        className="w-full h-24 lg:h-32 bg-gray-50 border border-transparent focus:border-[#f05189] focus:bg-white rounded-[20px] py-4 px-5 outline-none transition-all font-bold text-gray-800 text-xs resize-none"
                                        required
                                    />
                                </div>

                                <div className="pt-2 flex flex-col md:flex-row gap-3">
                                    <button
                                        type="button"
                                        className="flex-1 py-3 px-6 border-2 border-gray-100 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-all uppercase tracking-widest text-[9px]"
                                    >
                                        Save as Draft
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[1.5] py-3 px-6 bg-[#f05189] disabled:bg-[#f05189]/50 text-white rounded-xl font-black shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-[9px]"
                                    >
                                        {loading ? "Publishing..." : "Publish Missing Post"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- MOBILE NAVIGATION --- */}
            <MobileNav />
        </div>
    );
};

export default AddMissingPost;