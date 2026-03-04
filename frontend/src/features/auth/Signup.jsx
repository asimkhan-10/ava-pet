import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, ImageIcon } from 'lucide-react';
import logo from "../../assets/logo.png"
import api from "../../services/api"
const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        location: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/register', formData)
            if (response.status === 200 || response.status === 201) {
                alert("Account Created Successfully!");
                navigate('/login');
            }
        } catch (error) {
            const errorData = error.response?.data;
            if (error.response?.status === 422) {
                const firstError = Object.values(errorData)[0][0];
                alert(firstError);
            } else {
                alert(errorData?.message || "Registration failed. Please try again.");
            }
        }
    }
    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                {/* Left Panel: Branding / Visuals (Matches Login split-screen) */}
                <div className="md:w-1/2 bg-[#fdf2f5] p-8 md:p-10 flex flex-col justify-center relative overflow-hidden hidden md:flex">


                    <div className="z-10 relative flex items-center justify-center mb-6">
                        <img src={logo} alt="AVA Pets Logo" className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-sm" />
                    </div>

                    <div className="z-10 relative">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 leading-tight">
                            Join the <br /> Pack Today!
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 font-medium">
                            Create your account to start exploring playdates, sharing moments, and finding your pet's new best friends.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Signup Form */}
                <div className="md:w-1/2 flex flex-col justify-center bg-white relative">



                    <div className="px-8 md:px-12 py-6 md:py-6 flex flex-col z-10 w-full">
                        <div className="mb-4 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Create your account</h1>
                            <p className="text-gray-500 font-medium text-xs md:text-sm hidden md:block">Let's get you set up with your AVA profile.</p>
                        </div>
                        <form onSubmit={handleSignup} className="space-y-4">

                            <div className="flex flex-col space-y-1.5 z-20">
                                <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="first_name"
                                        placeholder="Enter your first name"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="w-full bg-[#fdf2f5] md:bg-gray-50 border-2 border-transparent md:border-gray-200 focus:border-[#f05189] focus:bg-white focus:ring-2 focus:ring-[#f05189]/10 rounded-[18px] md:rounded-xl py-2.5 px-5 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800 pr-12 text-sm"
                                        required
                                    />
                                    {formData.first_name && (
                                        <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4 md:w-5 md:h-5 pointer-events-none" />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1.5 z-20">
                                <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="last_name"
                                        placeholder="Enter your last name"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="w-full bg-[#fdf2f5] md:bg-gray-50 border-2 border-transparent md:border-gray-200 focus:border-[#f05189] focus:bg-white focus:ring-2 focus:ring-[#f05189]/10 rounded-[18px] md:rounded-xl py-2.5 px-5 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800 pr-12 text-sm"
                                        required
                                    />
                                    {formData.last_name && (
                                        <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4 md:w-5 md:h-5 pointer-events-none" />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1.5 z-20">
                                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#fdf2f5] md:bg-gray-50 border-2 border-transparent md:border-gray-200 focus:border-[#f05189] focus:bg-white focus:ring-2 focus:ring-[#f05189]/10 rounded-[18px] md:rounded-xl py-2.5 px-5 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800 pr-12 text-sm"
                                        required
                                    />
                                    {formData.email.includes('@') && (
                                        <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4 md:w-5 md:h-5 pointer-events-none" />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1.5 z-20">
                                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-[#fdf2f5] md:bg-gray-50 border-2 border-transparent md:border-gray-200 focus:border-[#f05189] focus:bg-white focus:ring-2 focus:ring-[#f05189]/10 rounded-[18px] md:rounded-xl py-2.5 px-5 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800 pr-12 text-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                                        ) : (
                                            <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1.5 z-20">
                                <label className="text-sm font-bold text-gray-700 ml-1">Location</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Philadelphia"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-[#fdf2f5] md:bg-gray-50 border-2 border-transparent md:border-gray-200 focus:border-[#f05189] focus:bg-white focus:ring-2 focus:ring-[#f05189]/10 rounded-[18px] md:rounded-xl py-2.5 px-5 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-800 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2 z-20 relative">
                                <button
                                    type="submit"
                                    className="w-full bg-[#f05189] hover:bg-[#d43d71] text-white py-3 md:py-3.5 rounded-[18px] md:rounded-xl font-bold shadow-lg shadow-[#f05189]/30 active:scale-[0.98] transition-all text-sm md:text-base flex items-center justify-center gap-2"
                                >
                                    <span>Get Started</span>
                                    <svg className="w-5 h-5 -mt-0.5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-400 font-medium text-xs md:text-sm tracking-wide">
                                Already have an account?
                                <span
                                    onClick={() => navigate('/login')}
                                    className="text-[#f05189] font-extrabold cursor-pointer ml-1.5 hover:underline"
                                >
                                    Log In
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
