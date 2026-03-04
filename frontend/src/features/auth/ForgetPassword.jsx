import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react'; // Added ArrowLeft for a cleaner icon
import logo from "../../assets/logo.png";
import forgetImg from "../../assets/forget.png";
import api from "../../services/api";

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        try {
            await api.post('/otp-send', { email });
            localStorage.setItem('resetEmail', email);
            navigate('/verify');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send OTP.");
        }
    };

    return (
        // Use h-screen and overflow-hidden to prevent the body from scrolling
        <div className="h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
            {/* max-h-[90vh] ensures the card doesn't exceed the viewport height */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">

                {/* Left Panel: Branding */}
                <div className="hidden md:flex md:w-1/2 bg-[#fdf2f5] p-10 flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-100/50 rounded-full blur-2xl"></div>

                    <img src={logo} alt="AVA Pets Logo" className="w-48 h-48 object-contain mb-8 z-10" />

                    <div className="z-10">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-4 leading-tight">
                            Your Pet's <br /> Best Friend
                        </h2>
                        <p className="text-gray-600 font-medium px-4">
                            Join our community to connect, share, and find the perfect playdates for your furry companions.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Form */}
                <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col bg-white overflow-y-auto">

                    {/* Header with Back Button */}
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="text-center flex-grow flex flex-col justify-center">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-700 mb-6">Forgot Password</h1>

                        <div className="flex justify-center mb-6">
                            <img
                                src={forgetImg}
                                alt="Forgot Password Lock"
                                className="w-32 h-32 md:w-36 md:h-36 object-contain"
                            />
                        </div>

                        <p className="text-gray-600 font-medium text-sm md:text-base mb-8 px-4">
                            Provide your account's email for which you want to reset your password
                        </p>

                        <form onSubmit={handleSend} className="space-y-6 text-left">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#fbfbfb] border border-pink-200 focus:border-[#f05189] focus:ring-4 focus:ring-[#f05189]/5 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-gray-800"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#f05189] hover:bg-[#d43d71] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#f05189]/20 active:scale-[0.98] transition-all tracking-widest"
                            >
                                SEND
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;