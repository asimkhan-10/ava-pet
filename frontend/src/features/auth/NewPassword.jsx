import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import logo from "../../assets/logo.png";
import newpassImg from "../../assets/newpass.png";
import api from "../../services/api";

const NewPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const email = localStorage.getItem('resetEmail');
        if (!email) {
            alert("Session expired or email not found. Please restart the password reset process.");
            navigate('/forgot-password');
            return;
        }

        try {
            const response = await api.post('/reset-password', {
                email: email,
                password: formData.password
            });
            alert(response.data.message || "Password Updated Successfully");
            localStorage.removeItem('resetEmail');
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            alert(errorMessage);
        }
    };

    return (
        <div className="h-screen bg-[#f3f4f6] flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col md:flex-row">

                {/* Left Panel */}
                <div className="hidden md:flex md:w-1/2 bg-[#fdf2f5] p-10 flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-100/50 rounded-full blur-2xl"></div>
                    <img src={logo} alt="AVA Pets Logo" className="w-48 h-48 object-contain mb-8 z-10" />
                    <div className="z-10">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-4 leading-tight">Your Pet's <br /> Best Friend</h2>
                        <p className="text-gray-600 font-medium px-4">Join our community to connect, share, and find the perfect playdates for your furry companions.</p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-1/2 p-6 md:px-12 md:py-8 flex flex-col bg-white overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center mb-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="text-center flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-700 mb-4">New Credentials</h1>

                        <div className="flex justify-center mb-4">
                            <img src={newpassImg} alt="New Credentials" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
                        </div>

                        <p className="text-gray-600 font-medium text-sm md:text-base mb-6 px-2">
                            <span className="block font-bold mb-1">Your identity has been verified!</span>
                            Set your new password
                        </p>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-[#fbfbfb] border border-pink-200 focus:border-[#f05189] focus:ring-4 focus:ring-[#f05189]/5 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all font-medium text-gray-800"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-[#fbfbfb] border border-pink-200 focus:border-[#f05189] focus:ring-4 focus:ring-[#f05189]/5 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all font-medium text-gray-800"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-[#f05189] hover:bg-[#d43d71] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#f05189]/20 active:scale-[0.98] transition-all tracking-widest uppercase">
                                    UPDATE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPassword;
