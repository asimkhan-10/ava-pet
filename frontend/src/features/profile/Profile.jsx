import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Dog, Camera, KeyRound, LogOut, Edit2 } from 'lucide-react';
import api from '../../services/api';

import Sidebar from '../../components/Sidebar';
import DesktopHeader from '../../components/DesktopHeader';
import MobileNav from '../../components/MobileNav';
import AddDog from './AddDog';
import ChangePassword from './ChangePassword';

// Helper to fix image URL
const fixImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) {
        return url.replace('http://localhost:8000', 'http://127.0.0.1:8000');
    }
    return url.startsWith('/') ? `http://127.0.0.1:8000${url}` : `http://127.0.0.1:8000/${url}`;
};

const DesktopProfileField = ({ label, value, name, onChange, isEditing = true }) => (
    <div className="space-y-1.5 mb-5 lg:mb-6">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
        {isEditing ? (
            <input 
                type="text"
                name={name}
                value={value || ''}
                onChange={onChange}
                className="w-full bg-gray-50 border border-transparent focus:border-[#f05189] rounded-xl py-3.5 px-5 outline-none transition-all font-bold text-gray-800 text-sm"
            />
        ) : (
            <div className="w-full bg-gray-50 border border-transparent rounded-xl py-3.5 px-5 font-bold text-gray-800 text-sm">
                {value}
            </div>
        )}
    </div>
);

const ProfileHeader = () => {
    const navigate = useNavigate();
    return (
        <header className="lg:hidden bg-[#f05189] text-white flex items-center justify-between px-5 pt-10 pb-4 sticky top-0 z-40 shadow-md shrink-0 w-full">
            <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white/20 hover:bg-white/30 transition-colors border border-white/30 backdrop-blur-sm"
            >
                <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>
            <h1 className="text-center text-lg font-bold">My Profile</h1>
            <button className="w-10 h-10 flex items-center justify-center text-white/90">
                <Dog className="w-6 h-6" />
            </button>
        </header>
    );
};

const Profile = () => {
    const [activeTab, setActiveTab] = useState('edit-profile');
    const [originalProfile, setOriginalProfile] = useState(null);
    const [userProfile, setUserProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        location: '',
        profile_image: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [newImageFile, setNewImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                if (response.data && response.data.success) {
                    const userData = response.data.data;
                    let first_name = userData.first_name;
                    let last_name = userData.last_name;
                    
                    if (!first_name && userData.name) {
                       const parts = userData.name.split(' ');
                       first_name = parts[0];
                       last_name = parts.slice(1).join(' ');
                    }

                    const profileData = {
                        first_name: first_name || '',
                        last_name: last_name || '',
                        email: userData.email || '',
                        location: userData.location || '',
                        profile_image: userData.profile_image || ''
                    };

                    setUserProfile(profileData);
                    setOriginalProfile(profileData);
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const hasChanges = () => {
        if (!originalProfile) return false;
        if (newImageFile !== null) return true;
        return (
            userProfile.first_name !== originalProfile.first_name ||
            userProfile.last_name !== originalProfile.last_name ||
            userProfile.email !== originalProfile.email ||
            userProfile.location !== originalProfile.location
        );
    };

    const handleSave = async () => {
        if (!hasChanges()) return;

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('first_name', userProfile.first_name);
            formData.append('last_name', userProfile.last_name);
            formData.append('email', userProfile.email);
            formData.append('location', userProfile.location);

            if (newImageFile) {
                formData.append('profile_image', newImageFile);
            }

            const response = await api.post('/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data && response.data.success) {
                alert('Profile updated successfully!');
                
                // Update original state to reflect what was saved
                const updatedData = response.data.data;
                const savedProfileData = {
                    first_name: updatedData.first_name || userProfile.first_name,
                    last_name: updatedData.last_name || userProfile.last_name,
                    email: updatedData.email || userProfile.email,
                    location: updatedData.location || userProfile.location,
                    profile_image: updatedData.profile_image || userProfile.profile_image
                };
                
                setUserProfile(savedProfileData);
                setOriginalProfile(savedProfileData);
                setNewImageFile(null); // Clear new image flag
                
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('An error occurred while saving the profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const renderProfileAvatar = () => {
        if (imagePreview) return imagePreview;
        if (userProfile.profile_image) return fixImageUrl(userProfile.profile_image);
        return null;
    };

    return (
        <div className="h-screen bg-[#f8f9fb] flex overflow-hidden">
            {/* Sidebar - No margin on left */}
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <DesktopHeader />
                <ProfileHeader />

                {/* Content Area - Removed heavy padding to prevent margins */}
                <div className="flex-1 overflow-y-auto p-0 lg:p-8 flex flex-col custom-scrollbar">

                    {/* The White Card Container */}
                    <div className="w-full bg-white lg:rounded-[40px] lg:shadow-sm lg:border border-gray-100 p-6 lg:p-12 relative pb-28 flex flex-col grow shrink-0 min-h-max">

                        {/* Header Section */}
                        {activeTab !== 'change-password' && (
                            <>
                                <div className="mb-10 lg:mb-12 flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-black text-[#1a1c21] tracking-tight">My Profile</h1>
                                        <p className="text-gray-400 font-medium text-sm mt-1">Manage your account and pets</p>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="lg:flex hidden items-center gap-2 text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>

                                {/* Profile Photo - Matching the rounded square in screenshot */}
                                <div className="flex justify-center lg:justify-start mb-10">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageChange} 
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                    <div 
                                        className="relative w-32 h-32 lg:w-40 lg:h-40 group cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="w-full h-full bg-[#fdf2f5] rounded-[32px] lg:rounded-[45px] flex items-center justify-center border-2 border-[#f05189]/5 transition-all group-hover:border-[#f05189]/20 overflow-hidden">
                                            {renderProfileAvatar() ? (
                                                <img src={renderProfileAvatar()} className="w-full h-full object-cover" alt="Profile avatar" />
                                            ) : (
                                                <Camera className="w-10 h-10 lg:w-12 lg:h-12 text-[#f05189] opacity-60" />
                                            )}
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-[#f05189] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-transform group-hover:scale-110">
                                            {renderProfileAvatar() ? (
                                                <Edit2 className="w-5 h-5 text-white" />
                                            ) : (
                                                <span className="font-bold text-xl">+</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tab Switcher - Rounded Split Design */}
                                <div className="w-full max-w-md flex border-2 border-[#f05189] rounded-2xl overflow-hidden mb-12">
                                    <button
                                        onClick={() => setActiveTab('edit-profile')}
                                        className={`flex-1 py-4 text-center font-bold text-sm transition-all
                                        ${activeTab === 'edit-profile' ? 'bg-[#f05189] text-white' : 'bg-white text-[#f05189]'}`}
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('add-dog')}
                                        className={`flex-1 py-4 text-center font-bold text-sm border-l-2 border-[#f05189] transition-all
                                        ${activeTab === 'add-dog' ? 'bg-[#f05189] text-white' : 'bg-white text-[#f05189]'}`}
                                    >
                                        Add Dog
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Form Fields */}
                        {activeTab === 'edit-profile' && (
                            <div className="w-full max-w-3xl">
                                {loading ? (
                                    <p className="text-gray-500 text-sm">Loading profile information...</p>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                                            <DesktopProfileField label="First Name" name="first_name" value={userProfile.first_name} onChange={handleChange} />
                                            <DesktopProfileField label="Last Name" name="last_name" value={userProfile.last_name} onChange={handleChange} />
                                            <div className="lg:col-span-2">
                                                <DesktopProfileField label="Email Address" name="email" value={userProfile.email} onChange={handleChange} />
                                            </div>
                                            <div className="lg:col-span-2">
                                                <DesktopProfileField label="Location" name="location" value={userProfile.location} onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-col lg:flex-row gap-4">
                                            <button 
                                                onClick={handleSave}
                                                disabled={saving || !hasChanges()}
                                                className={`bg-[#f05189] text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-pink-500/20 transition-all ${saving ? 'opacity-70 cursor-not-allowed' : (!hasChanges() ? 'opacity-40 cursor-default' : 'hover:opacity-90')}`}
                                            >
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('change-password')}
                                                className="flex items-center justify-center gap-2 text-[#f05189] font-bold text-[11px] uppercase tracking-widest px-6 hover:bg-pink-50 rounded-xl transition-all">
                                                <KeyRound className="w-4 h-4" />
                                                Change Password
                                            </button>
                                        </div>
                                        
                                        <div className="mt-12 lg:hidden">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-center gap-2 text-red-500 font-bold text-[11px] uppercase tracking-widest px-6 py-4 bg-red-50 rounded-xl transition-all"
                                            >
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Placeholder for Add Dog logic */}
                        {activeTab === 'add-dog' && (
                            <AddDog />
                        )}

                        {activeTab === 'change-password' && (
                            <ChangePassword onBack={() => setActiveTab('edit-profile')} />
                        )}
                    </div>
                </div>
            </main>
            <MobileNav />
        </div>
    );
};

export default Profile;