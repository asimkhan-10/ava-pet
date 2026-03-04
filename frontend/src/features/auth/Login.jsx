import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png"
import api from "../../services/api";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/login', formData);
            if (response.data.token) {
                // Save token and user details in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                if (response.data.is_first_login) {
                    navigate('/onboarding');
                } else {
                    navigate('/home');
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                {/* Left Panel: Branding / Visuals */}
                <div className="md:w-1/2 bg-[#fdf2f5] p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
                    {/* Decorative Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#fce4ed] rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#fce4ed] rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
                    </div>

                    <div className="z-10 relative flex items-center justify-center">
                        <img src={logo} alt="AVA Pets Logo" className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-sm mb-6" />
                    </div>

                    <div className="z-10 relative mt-auto">
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
                            Your Pet's <br /> Best Friend
                        </h2>
                        <p className="text-lg text-gray-600 font-medium">
                            Join our community to connect, share, and find the perfect playdates for your furry companions.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Login Form */}
                <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white relative">

                    {/* Mobile Only Logo */}
                    <div className="md:hidden flex justify-center mb-8">
                        <img src={logo} alt="AVA Pets Logo" className="w-40 h-40 object-contain drop-shadow-md" />
                    </div>
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500 font-medium text-sm md:text-base">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 focus:border-[#f05189] focus:bg-white focus:ring-4 focus:ring-[#f05189]/10 rounded-xl py-3.5 px-5 outline-none transition-all placeholder:text-gray-400 font-medium"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm font-bold text-[#f05189] hover:text-[#d43d71] transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 focus:border-[#f05189] focus:bg-white focus:ring-4 focus:ring-[#f05189]/10 rounded-xl py-3.5 px-5 outline-none transition-all placeholder:text-gray-400 font-medium"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-[#f05189] hover:bg-[#d43d71] text-white py-4 rounded-xl font-bold text-base md:text-lg shadow-lg shadow-[#f05189]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 font-medium text-sm">
                            Don't have an account?
                            <span
                                onClick={() => navigate('/signup')}
                                className="text-[#f05189] font-bold cursor-pointer ml-1.5 hover:underline"
                            >
                                Sign up for free
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;