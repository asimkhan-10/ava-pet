import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import slider1 from "../../assets/slider1.png"
import slider2 from "../../assets/slider2.png"
import slider3 from "../../assets/slider3.png"
import slider4 from "../../assets/slider4.png"
import slider5 from "../../assets/slider5.png"
const Onboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Create your dog profile\nin very easy way",
            // Placeholder: you can replace these with your actual images later!
            image: slider1
        },
        {
            id: 2,
            title: "Discover dogs nearby\nyou",
            image: slider2
        },
        {
            id: 3,
            title: "Find nice place and friendly\natmosphere near your\nplaces on the map",
            image: slider3
        },
        {
            id: 4,
            title: "Discover friendly events &\nhost your dogs play dates",
            image: slider4
        },
        {
            id: 5,
            title: "Discover lost dogs & alert\nto found lost dogs",
            image: slider5
        }
    ];

    const handleNext = () => {
        if (currentStep < slides.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            navigate('/home'); // Move into the app!
        }
    };

    const handleSkip = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
            {/* Main Web-sized Container (matches Login/Signup) */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                {/* Left Panel: Visuals & Pink Background */}
                <div className="w-full md:w-1/2 bg-[#fdf2f5] p-8 md:p-12 flex flex-col justify-center items-center relative min-h-[300px] md:min-h-0">
                    {/* Pink decorative blur elements */}
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#fce4ed] rounded-full mix-blend-multiply opacity-70 blur-2xl"></div>
                    <div className="absolute top-10 -right-10 w-40 h-40 bg-[#fce4ed] rounded-full mix-blend-multiply opacity-70 blur-2xl"></div>

                    {/* Slider Image */}
                    <div className="relative z-10 w-full flex justify-center items-center h-full">
                        <img
                            src={slides[currentStep].image}
                            alt="Onboarding Illustration"
                            className="w-full h-auto max-h-[250px] md:max-h-[400px] object-contain drop-shadow-xl transition-all duration-500"
                        />
                    </div>
                </div>

                {/* Right Panel: Content */}
                <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white relative">

                    {/* Skip Button */}
                    <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
                        <button
                            onClick={handleSkip}
                            className="text-[#f05189] font-bold text-sm md:text-base hover:text-[#d43d71] transition-colors"
                        >
                            Skip
                        </button>
                    </div>

                    <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full text-center md:text-left mt-8 md:mt-0">

                        {/* The Page Dots */}
                        <div className="flex justify-center md:justify-start gap-2 mb-8 md:mb-10">
                            {slides.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${index === currentStep ? 'w-8 bg-[#f05189]' : 'w-2.5 bg-pink-100'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Description Text */}
                        <div className="mb-10 flex-grow flex items-center justify-center md:justify-start">
                            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 whitespace-pre-line leading-tight">
                                {slides[currentStep].title}
                            </h2>
                        </div>

                        {/* Next Button */}
                        <div className="mt-auto md:mt-0">
                            <button
                                onClick={handleNext}
                                className="w-full bg-[#f05189] hover:bg-[#d43d71] text-white py-4 rounded-xl md:rounded-2xl font-bold shadow-lg shadow-[#f05189]/20 active:scale-[0.98] transition-all tracking-widest uppercase text-sm md:text-base"
                            >
                                {currentStep === slides.length - 1 ? "Start" : "Next"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
