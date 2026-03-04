import React from 'react';
import { Map, Navigation } from 'lucide-react';

const NearbyCard = ({ dog }) => {
    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-5 group cursor-pointer">
            {/* Dog Image */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-xl text-gray-900 leading-tight truncate pr-4">{dog.name}</h3>
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-400 shrink-0 mt-1 whitespace-nowrap">
                        {dog.time}
                    </span>
                </div>

                <p className="text-xs sm:text-sm font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                    {dog.distance} MI Away
                </p>

                <p className="text-[11px] sm:text-xs text-gray-500 truncate leading-snug pr-12">
                    {dog.address}
                </p>
            </div>

            {/* Directions Button */}
            <div className="flex flex-col items-center justify-center shrink-0 pr-2">
                <button className="w-10 h-10 bg-pink-50 text-[#f05189] rounded-xl flex items-center justify-center group-hover:bg-[#f05189] group-hover:text-white transition-colors duration-300 shadow-sm border border-pink-100">
                    <Navigation className="w-5 h-5 fill-current" />
                </button>
                <span className="text-[10px] font-black mt-1.5 text-black">Directions</span>
            </div>
        </div>
    );
};

export default NearbyCard;
