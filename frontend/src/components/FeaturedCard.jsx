import React from 'react';

const FeaturedCard = () => {
    return (
        <div className="relative w-full h-[340px] rounded-[40px] overflow-hidden shadow-2xl group cursor-pointer border-4 border-white">
            <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1200"
                alt="Dog Feature"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <div className="inline-block px-4 py-2 bg-[#f05189] text-white text-xs font-bold rounded-lg mb-4 self-start tracking-widest uppercase">
                    Community Alert
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-md">Find Missing Dogs Nearby</h2>
                <p className="text-white/90 font-medium text-lg leading-relaxed max-w-xl">
                    Our community alert system helps you find missing pets within 100 miles. Active search parties currently in Philadelphia.
                </p>
            </div>
        </div>
    );
};

export default FeaturedCard;
