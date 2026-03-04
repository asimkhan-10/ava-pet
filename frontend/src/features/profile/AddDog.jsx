import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import api from '../../services/api';

const fixImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) {
        return url.replace('http://localhost:8000', 'http://127.0.0.1:8000');
    }
    return url.startsWith('/') ? `http://127.0.0.1:8000${url}` : `http://127.0.0.1:8000/${url}`;
};

const AddDog = () => {
    const [myDogs, setMyDogs] = useState([]);
    const [dogData, setDogData] = useState({
        name: '',
        breed: '',
        description: '',
        location: '' // location acts as last_location for owned dog
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const fileInputRef = useRef(null);

    const fetchMyDogs = async () => {
        try {
            const response = await api.get('/my-dogs');
            if (response.data && response.data.success) {
                setMyDogs(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch my dogs:', error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchMyDogs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDogData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateDog = async () => {
        if (!dogData.name || !dogData.breed || !dogData.location) {
            alert('Please fill out name, breed, and location fields.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', dogData.name);
            formData.append('breed', dogData.breed);
            formData.append('location', dogData.location);
            formData.append('description', dogData.description || 'No description');
            
            images.forEach(img => {
                formData.append('images[]', img);
            });

            const response = await api.post('/dogs/mine', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data && response.data.success) {
                alert('Dog profile created successfully!');
                // Reset form
                setDogData({ name: '', breed: '', description: '', location: '' });
                setImages([]);
                setImagePreviews([]);
                // Refresh list
                fetchMyDogs();
            } else {
                alert('Failed to create dog profile.');
            }
        } catch (error) {
            console.error('Error creating dog profile:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT COLUMN: My Dogs List */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-gray-800 tracking-tight">My Dogs</h3>
                        <span className="text-[#f05189] text-[10px] font-black uppercase bg-pink-50 px-3 py-1.5 rounded-lg tracking-widest">
                            {myDogs.length} Pets Total
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {fetching ? (
                            <p className="text-gray-500 text-sm">Loading your dogs...</p>
                        ) : myDogs.length > 0 ? (
                            myDogs.map((dog, idx) => {
                                const imgSrc = dog.images && dog.images.length > 0 
                                    ? fixImageUrl(dog.images[0]) 
                                    : 'https://via.placeholder.com/150';

                                return (
                                    <div key={dog.id || idx} className="bg-white border border-gray-100 rounded-[24px] p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                                            {dog.images && dog.images.length > 0 ? (
                                                <img src={imgSrc} alt={dog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <Dog className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 relative">
                                            <h4 className="font-bold text-gray-900 text-lg mb-0.5">{dog.name}</h4>
                                            <span className="text-[10px] font-black uppercase text-[#f05189] block mb-1 tracking-tighter">
                                                {dog.breed}
                                            </span>
                                            <p className="text-[11px] text-gray-400 truncate font-medium">{dog.last_location || 'Address...'}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-sm">No dogs added yet.</p>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Add Dog Form */}
                <div className="lg:col-span-7 lg:pl-12 lg:border-l border-gray-100">
                    <div className="flex flex-col items-start mb-10">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Add Dog's Images</h3>

                        <div className="flex flex-wrap items-center gap-4">
                            {imagePreviews.map((src, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-200">
                                    <img src={src} className="w-full h-full object-cover" alt="preview" />
                                    <button 
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            
                            {/* Add Button */}
                            <button 
                                onClick={triggerFileInput}
                                className="w-24 h-24 rounded-[24px] bg-[#fdf2f5] border-2 border-dashed border-[#f05189]/30 flex items-center justify-center text-[#f05189] hover:bg-[#f05189] hover:text-white transition-all group"
                            >
                                <span className="text-4xl font-light mb-1">+</span>
                            </button>
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                            />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <input
                            type="text"
                            name="name"
                            value={dogData.name}
                            onChange={handleChange}
                            placeholder="Dog's Name"
                            className="w-full bg-gray-50 border border-transparent focus:border-[#f05189]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-800 text-sm placeholder:text-gray-400"
                        />
                        <input
                            type="text"
                            name="breed"
                            value={dogData.breed}
                            onChange={handleChange}
                            placeholder="Dog's Breed"
                            className="w-full bg-gray-50 border border-transparent focus:border-[#f05189]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-800 text-sm placeholder:text-gray-400"
                        />
                        <input
                            type="text"
                            name="location"
                            value={dogData.location}
                            onChange={handleChange}
                            placeholder="Location"
                            className="w-full bg-gray-50 border border-transparent focus:border-[#f05189]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-800 text-sm placeholder:text-gray-400"
                        />
                        <textarea
                            name="description"
                            value={dogData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            rows={4}
                            className="w-full bg-gray-50 border border-transparent focus:border-[#f05189]/30 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-gray-800 text-sm placeholder:text-gray-400 resize-none"
                        ></textarea>

                        <button 
                            onClick={handleCreateDog}
                            disabled={loading}
                            className={`w-full bg-[#f05189] text-white py-5 rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-pink-500/20 transition-all mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
                        >
                            {loading ? 'Creating...' : 'Create Dog Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDog;
