import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import DesktopHeader from "../../components/DesktopHeader";
import MobileHeader from "../../components/MobileHeader";
import MobileNav from "../../components/MobileNav";
import api from "../../services/api";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Dynamic Map Recenter Component
const MapUpdater = ({ center, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    } else if (center) {
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [center, bounds, map]);
  return null;
};

const NearbyCard = ({ dog, onShowRoute }) => {
  const navigate = useNavigate();

  // Resolve Image
  let imageUrl =
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // fallback
  if (dog.images && Array.isArray(dog.images) && dog.images.length > 0) {
    imageUrl = dog.images[0];
  } else if (typeof dog.images === "string") {
    try {
      const parsed = JSON.parse(dog.images);
      if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
    } catch (e) {
      imageUrl = dog.images;
    }
  }

  // Resolve time
  const timeDisplay = dog.created_at
    ? new Date(dog.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "Recent";

  // Smart distance formatter: show meters for very close, km for farther
  const distKm = dog.distance !== undefined ? Number(dog.distance) : null;
  let distFormat, distUnit;
  if (distKm === null) {
    distFormat = "?";
    distUnit = "KM";
  } else if (distKm < 1) {
    distFormat = Math.round(distKm * 1000);
    distUnit = "M";
  } else {
    distFormat = distKm.toFixed(1);
    distUnit = "KM";
  }

  return (
    <div
      onClick={() => navigate("/home")}
      className="bg-[#fafafa] sm:bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex items-stretch gap-4 sm:gap-5 group cursor-pointer relative overflow-hidden"
    >
      {/* Dog Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
        <img
          src={imageUrl}
          alt={dog.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col justify-between py-1 min-w-0 pr-[70px]">
        {/* Time */}
        <span className="absolute top-4 right-5 text-[10px] sm:text-xs font-semibold text-gray-400 shrink-0">
          {timeDisplay}
        </span>

        <h3 className="font-bold text-xl text-gray-900 leading-tight truncate mb-1 pr-16">
          {dog.name}
        </h3>

        <div>
          <p className="text-xs sm:text-sm font-black text-[#f05189] mb-1.5 uppercase tracking-wide">
            {distFormat} {distUnit} Away
          </p>

          <p className="text-[11px] sm:text-xs text-gray-500 leading-tight pr-4">
            {dog.last_location || "Location Unknown"}
          </p>
        </div>
      </div>

      {/* Directions Button */}
      <div className="absolute right-5 bottom-4 flex flex-col items-center justify-center shrink-0">
        <button 
          onClick={(e) => { e.stopPropagation(); onShowRoute(dog); }}
          className="w-10 h-10 bg-pink-50 text-[#f05189] rounded-xl flex items-center justify-center group-hover:bg-[#f05189] group-hover:text-white transition-colors duration-300 border border-pink-100 mb-1"
        >
          <Navigation className="w-5 h-5 fill-current" />
        </button>
        <span className="text-[9px] font-black text-black">Directions</span>
      </div>
    </div>
  );
};

const Nearby = () => {
  const [nearbyDogs, setNearbyDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState([39.9526, -75.1652]);
  const [activeRoute, setActiveRoute] = useState(null);

  const loadNearbyDogs = () => {
    setLoading(true);
    const fetchNearby = async (lat, lng) => {
      try {
        // Fetch dogs within a 10 km radius
        const response = await api.get(
          `/dogs/nearby?lat=${lat}&lng=${lng}&radius=10`,
        );
        if (response.data && response.data.success) {
          setNearbyDogs(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch nearby dogs:", error);
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);
          fetchNearby(lat, lng);
        },
        (error) => {
          console.warn(
            "Geolocation blocked/failed. Using default location.",
            error,
          );
          fetchNearby(userLocation[0], userLocation[1]); // Fallback coords
        },
        { timeout: 8000 }
      );
    } else {
      fetchNearby(userLocation[0], userLocation[1]);
    }
  };

  useEffect(() => {
    loadNearbyDogs();
  }, []);

  // Get images for map points & setup custom icons
  const createDogIcon = (dog) => {
    let imageUrl =
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    if (dog.images && Array.isArray(dog.images) && dog.images.length > 0) {
      imageUrl = dog.images[0];
    } else if (typeof dog.images === "string") {
      try {
        const p = JSON.parse(dog.images);
        if (p.length) imageUrl = p[0];
      } catch (e) {
        imageUrl = dog.images;
      }
    }

    if (imageUrl && imageUrl.startsWith("http://localhost:8000")) {
      imageUrl = imageUrl.replace(
        "http://localhost:8000",
        "http://127.0.0.1:8000",
      );
    } else if (imageUrl && imageUrl.startsWith("/")) {
      imageUrl = "http://127.0.0.1:8000" + imageUrl;
    }

    return L.divIcon({
      className: "custom-leaflet-icon",
      html: `
                <div class="relative group cursor-pointer" style="margin-top: -24px; margin-left: -20px;">
                    <div class="w-12 h-12 bg-white p-1 rounded-full shadow-md border-2 border-[#f05189] relative z-10 overflow-hidden transform hover:scale-110 transition-transform">
                        <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" class="rounded-full" alt="dog" />
                    </div>
                    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#f05189] rotate-45 z-0"></div>
                </div>
            `,
      iconSize: [48, 56],
      iconAnchor: [24, 56],
      popupAnchor: [0, -48],
    });
  };

  const userIcon = L.divIcon({
    className: "custom-leaflet-user-icon",
    html: `
            <div class="relative flex items-center justify-center pointer-events-none" style="margin-top: -24px; margin-left: -24px;">
                <div class="absolute w-12 h-12 bg-[#f05189]/40 rounded-full animate-ping"></div>
                <div class="relative w-8 h-8 bg-[#f05189] border-[3px] border-white rounded-full shadow-lg flex items-center justify-center z-10">
                    <div class="w-3 h-3 bg-white rounded-full"></div>
                </div>
            </div>
        `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">
      {/* --- WEB SIDEBAR (Hidden on mobile) --- */}
      <Sidebar />

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header */}
        <DesktopHeader />

        {/* Mobile Header (Hidden on desktop) - Using pink primary variant */}
        <MobileHeader title="Nearby Search" variant="primary" />

        {/* Dashboard Grid */}
        <div className="p-4 lg:p-10 grid grid-cols-1 xl:grid-cols-2 gap-10 flex-1">
          {/* Left Column: Nearby Dogs List */}
          <div className="space-y-4 lg:space-y-6 flex flex-col pt-2 lg:pt-0 pb-28 lg:pb-0 order-2 xl:order-1">
            {/* Section Header (Web Only) */}
            <div className="hidden xl:flex justify-between items-center px-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Nearby Missing Pets
              </h2>
              <button
                onClick={loadNearbyDogs}
                className="text-[#f05189] font-bold text-sm bg-pink-50 hover:bg-pink-100 transition-colors px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                {loading ? "Scanning..." : "Refresh Radius"}
              </button>
            </div>

            <p className="text-xs text-gray-400 font-bold tracking-widest uppercase pl-3 block xl:hidden">
              {loading
                ? "SEARCHING RADAR..."
                : `${nearbyDogs.length} REPORTS NEAR YOUR LOCATION`}
            </p>

            <div className="flex-1 flex flex-col gap-4">
              {loading ? (
                <div className="text-center py-10 text-gray-500 font-bold border-2 border-dashed border-gray-200 rounded-3xl mx-2 bg-gray-50 h-40 flex items-center justify-center">
                  Tracking GPS signals...
                </div>
              ) : nearbyDogs.length > 0 ? (
                nearbyDogs.map((dog) => (
                    <NearbyCard 
                      key={dog.id} 
                      dog={dog} 
                      onShowRoute={(d) => {
                        if (d.latitude && d.longitude && userLocation) {
                          setActiveRoute([userLocation, [parseFloat(d.latitude), parseFloat(d.longitude)]]);
                        }
                      }} 
                    />
                ))
              ) : (
                <div className="text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-3xl mx-2 bg-gray-50 h-40 flex items-center justify-center">
                  No missing pets tracked within 10 kilometers of your radar.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: INTERACTIVE MAP (Visible on Mobile too) */}
          <div
            className="flex flex-col bg-gray-50 rounded-[40px] shadow-sm border border-gray-100 relative h-[300px] shrink-0 xl:sticky xl:top-[120px] xl:h-[calc(100vh-160px)] mb-6 bottom-0 z-0 overflow-hidden order-1 xl:order-2"
            style={{ transform: "translateZ(0)" }}
          >
            {loading && !userLocation ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
                <span className="text-gray-400 font-bold tracking-widest uppercase flex items-center gap-2">
                  <Navigation className="w-5 h-5 animate-pulse" /> Tracking
                  Coordinates...
                </span>
              </div>
            ) : (
              <MapContainer
                center={userLocation}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", borderRadius: "40px" }}
                zoomControl={false}
              >
                <MapUpdater center={userLocation} bounds={activeRoute} />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* User Location */}
                <Marker position={userLocation} icon={userIcon}>
                  <Popup className="font-bold text-gray-800 rounded-2xl">
                    Your Location
                  </Popup>
                </Marker>

                {/* Scanner Circle */}
                <Circle
                  center={userLocation}
                  pathOptions={{
                    fillColor: "#f05189",
                    fillOpacity: 0.1,
                    color: "#f05189",
                    weight: 1.5,
                    dashArray: "4 4",
                  }}
                  radius={10000} /* 10km in meters */
                />

                {/* Dog Markers */}
                {nearbyDogs.map((dog) => {
                  if (dog.latitude && dog.longitude) {
                    return (
                      <Marker
                        key={dog.id}
                        position={[
                          parseFloat(dog.latitude),
                          parseFloat(dog.longitude),
                        ]}
                        icon={createDogIcon(dog)}
                      >
                        <Popup>
                          <div className="text-center w-40">
                            <h4 className="font-black text-gray-900 border-b border-gray-100 pb-1.5 mb-1.5 text-base">
                              {dog.name}
                            </h4>
                            <p className="text-[#f05189] font-bold text-xs uppercase mb-2 tracking-wide">
                              {dog.breed || "Unknown breed"}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  }
                  return null;
                })}

                {/* Active Route Polyline */}
                {activeRoute && (
                  <Polyline 
                    positions={activeRoute}
                    pathOptions={{ color: '#0ea5e9', weight: 4, dashArray: '8, 8' }} 
                  />
                )}
              </MapContainer>
            )}
          </div>
        </div>
      </main>

      {/* --- MOBILE NAVIGATION (Hidden on desktop) --- */}
      <MobileNav />
    </div>
  );
};

export default Nearby;
