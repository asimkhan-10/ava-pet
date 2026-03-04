import React from 'react';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeedCard = ({ post }) => {
    const navigate = useNavigate();
    // 1. Image Resolution (Handles Laravel JSON string arrays or literal arrays safely)
    let imageUrl = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // fallback
    if (post.images && Array.isArray(post.images) && post.images.length > 0) {
        imageUrl = post.images[0];
    } else if (post.image) {
        imageUrl = post.image;
    } else if (typeof post.images === 'string') {
        try {
            const parsed = JSON.parse(post.images);
            if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
        } catch (e) {
            imageUrl = post.images;
        }
    }

    // 2. Text Mapping
    const title = post.name || post.title || 'Unknown Pet';
    const description = post.description || 'No description provided.';
    const authorName = post.user?.first_name || post.author || 'Member';

    // 3. Time formatting
    const timeDisplay = post.created_at
        ? new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : (post.time || 'Recent');

    return (
        <div 
            onClick={() => navigate(`/missing-dog/${post.id}`)}
            className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
        >
            <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6">
                <img
                    src={imageUrl}
                    alt={title}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-gray-50 text-transparent"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#f05189] shadow-sm">
                    {timeDisplay}
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-800 leading-tight">{title}</h3>
                    <button className="text-gray-300 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 h-[20px] overflow-hidden mb-6">
                    {description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#fdf2f5] flex items-center justify-center text-[#f05189] font-bold text-xs uppercase shadow-sm">
                            {authorName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{authorName}</span>
                    </div>
                    <button className="text-[#f05189] font-bold text-xs bg-pink-50 hover:bg-pink-100 transition-colors px-4 py-2 rounded-xl">Read More</button>
                </div>
            </div>
        </div>
    );
};

export default FeedCard;
