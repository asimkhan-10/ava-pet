import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from "../../assets/logo.png";
import forgetImg from "../../assets/forget.png";
import api from "../../services/api";

const Verification = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(['', '', '', '']);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpCode = code.join('');
        if (otpCode.length !== 4) {
            alert("Please enter the complete 4-digit code.");
            return;
        }

        const email = localStorage.getItem('resetEmail');
        if (!email) {
            alert("Session expired. Please start over.");
            navigate('/forgot-password');
            return;
        }

        try {
            await api.post('/otp-verify', { email, otp: otpCode });
            navigate('/new-password');
        } catch (error) {
            alert(error.response?.data?.message || "Invalid OTP.");
        }
    };

    const handleResend = async () => {
        const email = localStorage.getItem('resetEmail');
        if (!email) {
            alert("Session expired. Please start over.");
            navigate('/forgot-password');
            return;
        }
        try {
            await api.post('/otp-send', { email });
            alert("OTP resent successfully.");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to resend OTP.");
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
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-700 mb-4">Verification</h1>

                        <div className="flex justify-center mb-4">
                            <img src={forgetImg} alt="Verification" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
                        </div>

                        <p className="text-gray-600 font-medium text-sm mb-6 px-2">
                            Enter the 4-digit verification code sent to your email address.
                        </p>

                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="flex justify-center gap-2 md:gap-4">
                                {code.map((data, index) => (
                                    <input
                                        key={index}
                                        className="w-12 h-12 md:w-16 md:h-16 text-center text-xl font-bold bg-[#fbfbfb] border border-pink-200 focus:border-[#f05189] focus:ring-4 focus:ring-[#f05189]/5 rounded-2xl outline-none transition-all"
                                        type="text"
                                        maxLength="1"
                                        value={data}
                                        onChange={e => handleChange(e.target, index)}
                                        onFocus={e => e.target.select()}
                                        required
                                    />
                                ))}
                            </div>

                            <button type="submit" className="w-full bg-[#f05189] hover:bg-[#d43d71] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#f05189]/20 active:scale-[0.98] transition-all tracking-widest uppercase">
                                VERIFY
                            </button>
                        </form>

                        <div className="mt-6">
                            <p className="text-gray-500 font-medium text-xs md:text-sm">
                                If you didn't receive a code!
                                <span onClick={handleResend} className="text-[#f05189] font-extrabold cursor-pointer ml-1.5 hover:underline">Resend</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verification;