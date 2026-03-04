import React, { useState } from 'react';
import { Lock, EyeOff, Eye, ShieldCheck, ArrowLeft } from 'lucide-react';

const PasswordInput = ({ placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative flex items-center w-full">
            <div className="absolute left-6 text-gray-400">
                <Lock className="w-5 h-5" strokeWidth={2} />
            </div>
            <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="w-full bg-transparent border border-gray-200 focus:border-[#f05189] focus:ring-4 focus:ring-[#f05189]/10 rounded-2xl py-4 flex-1 outline-none transition-all font-bold text-gray-800 text-sm placeholder:text-gray-400 placeholder:font-medium"
                style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
        </div>
    );
};

const ChangePassword = ({ onBack }) => {
    return (
        <div className="w-full animate-in fade-in zoom-in-95 duration-500">
            {/* Header / Back Action */}
            <div className="flex items-center gap-4 mb-8 lg:mb-12">
                <button
                    onClick={onBack}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-600 hover:bg-pink-50 hover:text-[#f05189] hover:border-pink-100 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
                </button>
                <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-[#1a1c21] tracking-tight">Change Password</h2>
                    <p className="text-gray-400 font-medium text-sm mt-1 hidden lg:block">Update your credentials to secure your account</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Visual / Illustration Area (Web adaptation) */}
                <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-[#fdf2f5] to-pink-50/50 rounded-[40px] p-12 aspect-square max-w-md mx-auto relative border border-pink-100/50 w-full h-full">
                    {/* Decorative blobs/shapes */}
                    <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#f05189]/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl"></div>

                    <div className="relative">
                        <div className="w-56 h-56 bg-[#f05189] rounded-[3rem] rotate-[10deg] shadow-2xl shadow-pink-500/20 flex flex-col items-center justify-center relative z-10 transition-transform duration-700 hover:rotate-12">
                            {/* Keyhole styling */}
                            <div className="w-8 h-8 rounded-full bg-[#fdf2f5] shadow-inner mb-[-4px]"></div>
                            <div className="w-6 h-12 bg-[#fdf2f5] rounded-b-xl"></div>
                        </div>

                        {/* Shield element mapping to provided UI */}
                        <div className="absolute -left-16 -top-10 bg-white p-5 rounded-[2rem] shadow-xl z-20 rotate-[-15deg] transition-transform duration-700 hover:rotate-[-5deg]">
                            <div className="bg-teal-500 rounded-2xl p-4 flex items-center justify-center">
                                <ShieldCheck className="w-14 h-14 text-white" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Area */}
                <div className="max-w-md w-full mx-auto lg:mx-0">

                    {/* Mobile visual simplified */}
                    <div className="lg:hidden flex justify-center mb-10 relative">
                        <div className="w-40 h-40 bg-[#f05189]/10 rounded-3xl rotate-[-10deg] flex items-center justify-center relative">
                            <Lock className="w-20 h-20 text-[#f05189]" strokeWidth={1.5} />
                            <div className="absolute -left-4 -bottom-4 bg-white p-3 rounded-2xl shadow-xl rotate-[15deg]">
                                <div className="bg-teal-500 rounded-xl p-3">
                                    <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <PasswordInput placeholder="Old Password" />
                        <PasswordInput placeholder="New Password" />
                        <PasswordInput placeholder="Confirm Password" />

                        <button className="w-full bg-[#f05189] text-white py-5 mt-4 rounded-[20px] font-black text-sm tracking-[0.1em] uppercase shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
