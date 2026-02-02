import {
  Building,
  Car,
  Home,
  MapPin,
  Navigation,
  Search,
  X,
  Loader2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const AddAddress = ({
  addAddress,
  updateAddress,
  editingAddress,
  setShowAddressModal,
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapError, setMapError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    type: "Home",
    name: "",
    phone: "",

    addressLine: "",
    landmark: "",
    location: {
      type: "Point",
      coordinates: [77.209, 28.6139],
    },
    isDefault: false,
  });

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const addressTypes = [
    { value: "Home", icon: Home, color: "bg-blue-100 text-blue-700" },
    { value: "Office", icon: Building, color: "bg-green-100 text-green-700" },
    { value: "Hotel", icon: Car, color: "bg-purple-100 text-purple-700" },
    { value: "Other", icon: MapPin, color: "bg-gray-100 text-gray-700" },
  ];

  // Extract location details from place name (same as Navbar)
  const extractLocationDetails = (placeName) => {
    const parts = placeName.split(",").map((part) => part.trim());
    let district = "";
    let state = "";
    let pincode = "";

    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes("India")) {
        state = parts[parts.length - 2] || "";
      } else {
        state = lastPart;
      }
    }

    if (parts.length > 1) {
      district = parts[parts.length - 2] || parts[1] || "";
      if (district === state) {
        district = parts[1] || parts[0] || "";
      }
    }

    const pincodeMap = {
      patna: "800001",
      delhi: "110001",
      mumbai: "400001",
      bangalore: "560001",
      chennai: "600001",
      kolkata: "700001",
      hyderabad: "500001",
      pune: "411001",
      ahmedabad: "380001",
      jaipur: "302001",
    };

    const locationKey = placeName.toLowerCase();
    for (const [key, code] of Object.entries(pincodeMap)) {
      if (locationKey.includes(key)) {
        pincode = code;
        break;
      }
    }

    return {
      district: district || "Unknown",
      state: state || "India",
      pincode: pincode || "000000",
    };
  };

  // Fetch location suggestions using OpenStreetMap API (same as Navbar)
  const fetchLocationSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ", India",
        )}&limit=5&addressdetails=1`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();

      const formattedSuggestions = data.map((item) => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        address: item.address || {},
      }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Reverse geocoding (same as Navbar)
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      );

      if (!response.ok) {
        throw new Error("Failed to reverse geocode");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return null;
    }
  };

  // Get current location (same logic as Navbar)
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoadingLocation(true);
    setMapError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const locationData = await reverseGeocode(latitude, longitude);

        if (locationData && locationData.display_name) {
          const locationDetails = extractLocationDetails(
            locationData.display_name,
          );

          const address = locationData.address;
          const cleanAddress =
            [
              address?.road,
              address?.neighbourhood || address?.suburb,
              address?.city || address?.town || address?.village,
            ]
              .filter(Boolean)
              .join(", ") || locationData.display_name.split(",")[0];

          const fullAddress = locationData.display_name;

          setFormData((prev) => ({
            ...prev,
            addressLine: fullAddress,
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          }));

          setSearchQuery(fullAddress);
          setCurrentLocation({ lat: latitude, lng: longitude });

          if (mapInstanceRef.current) {
            const { marker, mapDiv } = mapInstanceRef.current;
            const rect = mapDiv.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            marker.style.left = `${centerX}px`;
            marker.style.top = `${centerY}px`;
            marker.style.background = "#10b981";
          }
        } else {
          setFormData((prev) => ({
            ...prev,
            addressLine: "Current Location",
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          }));
          setSearchQuery("Current Location");
          setCurrentLocation({ lat: latitude, lng: longitude });
        }

        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Unable to retrieve your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        setMapError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && !mapInstanceRef.current) {
        const mapContainer = mapRef.current;
        mapContainer.innerHTML = "";

        const mapDiv = document.createElement("div");
        mapDiv.style.cssText = `
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, #e8f5e8 0%, #fff3e0 50%, #e3f2fd 100%);
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 177, 153, 0.1) 0%, transparent 50%);
        `;

        const marker = document.createElement("div");
        marker.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: #ef4444;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          z-index: 2;
          animation: pulse 2s infinite;
        `;

        const style = document.createElement("style");
        style.textContent = `
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
        `;
        document.head.appendChild(style);

        const coordsDisplay = document.createElement("div");
        coordsDisplay.style.cssText = `
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-family: monospace;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        coordsDisplay.textContent = `${formData.location.coordinates[1]?.toFixed(
          4,
        )}, ${formData.location.coordinates[0]?.toFixed(4)}`;

        const infoText = document.createElement("div");
        infoText.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, calc(-50% + 35px));
          text-align: center;
          color: #666;
          font-size: 12px;
          background: rgba(255,255,255,0.9);
          padding: 4px 8px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        infoText.textContent = "Click anywhere to select location";

        const gridOverlay = document.createElement("div");
        gridOverlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        `;

        mapDiv.appendChild(gridOverlay);
        mapDiv.appendChild(marker);
        mapDiv.appendChild(coordsDisplay);
        mapDiv.appendChild(infoText);

        mapDiv.addEventListener("click", (e) => {
          const rect = mapDiv.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const baseLatDelta = 0.02;
          const baseLngDelta = 0.02;
          const newLat = 28.6139 + (0.5 - y / rect.height) * baseLatDelta;
          const newLng = 77.209 + (x / rect.width - 0.5) * baseLngDelta;

          setFormData((prev) => ({
            ...prev,
            location: {
              type: "Point",
              coordinates: [newLng, newLat],
            },
          }));

          coordsDisplay.textContent = `${newLat.toFixed(4)}, ${newLng.toFixed(
            4,
          )}`;

          marker.style.transition = "all 0.3s ease";
          marker.style.left = `${x}px`;
          marker.style.top = `${y}px`;

          setTimeout(() => {
            const areas = ["Sector", "Block", "Phase", "Colony", "Nagar"];
            const numbers = Math.floor(Math.random() * 50) + 1;
            const cities = ["New Delhi", "Delhi", "Gurgaon", "Noida"];
            const selectedArea =
              areas[Math.floor(Math.random() * areas.length)];
            const selectedCity =
              cities[Math.floor(Math.random() * cities.length)];
            const pincode = `110${String(
              Math.floor(Math.random() * 100),
            ).padStart(3, "0")}`;

            const newAddress = `${selectedArea} ${numbers}, ${selectedCity}, Delhi ${pincode}`;
            setFormData((prev) => ({
              ...prev,
              addressLine: newAddress,
            }));
            setSearchQuery(newAddress);
          }, 800);
        });

        mapContainer.appendChild(mapDiv);
        mapInstanceRef.current = { mapDiv, marker, coordsDisplay };
      }
    };

    const timer = setTimeout(initializeMap, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && formData.location.coordinates) {
      const { coordsDisplay } = mapInstanceRef.current;
      const [lng, lat] = formData.location.coordinates;
      coordsDisplay.textContent = `${lat?.toFixed(4)}, ${lng?.toFixed(4)}`;
    }
  }, [formData.location]);

  const handleLocationSelect = (selectedLocation) => {
    const locationDetails = extractLocationDetails(selectedLocation.name);

    const addressParts = selectedLocation.name.split(",").slice(0, 3);
    const cleanAddress = addressParts.join(",").trim();

    setFormData((prev) => ({
      ...prev,
      addressLine: selectedLocation.name,
      location: {
        type: "Point",
        coordinates: [selectedLocation.lon, selectedLocation.lat],
      },
    }));

    setSearchQuery(selectedLocation.name);
    setSuggestions([]);
    setMapError("");

    if (mapInstanceRef.current) {
      const { marker } = mapInstanceRef.current;
      marker.style.background = "#3b82f6";
    }
  };

  const handleSearchLocation = (query) => {
    setSearchQuery(query);
    setMapError("");
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLocationSuggestions(searchQuery);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleSaveAddress = () => {
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (!formData.addressLine.trim()) {
      alert("Please enter address line");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (editingAddress) {
      updateAddress(editingAddress._id, formData);
    } else {
      addAddress(formData);
    }

    setShowAddressModal(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        type: editingAddress.type || "Home",
        name: editingAddress.name || "",
        phone: editingAddress.phone || "",

        addressLine: editingAddress.addressLine || "",
        landmark: editingAddress.landmark || "",
        location: editingAddress.location || {
          type: "Point",
          coordinates: [77.209, 28.6139],
        },
        isDefault: editingAddress.isDefault || false,
      });
      setSearchQuery(editingAddress.addressLine || "");
    }
  }, [editingAddress]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-gradient-to-br from-green-50 via-white to-orange-50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter your delivery address details
            </p>
          </div>
          <button
            onClick={() => setShowAddressModal(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Address Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Address Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {addressTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleInputChange("type", type.value)}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      formData.type === type.value
                        ? "border-green-500 bg-green-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <span className="block text-sm font-medium text-gray-700">
                      {type.value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Search Location
            </label>
            <div className="relative">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchLocation(e.target.value)}
                    placeholder="Search for area, landmark, or complete address"
                    className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                  />
                  {isLoadingSuggestions && (
                    <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                  )}
                </div>
                <button
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 shadow-md"
                >
                  {isLoadingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  {isLoadingLocation ? "Getting..." : "Use Current"}
                </button>
              </div>

              {/* Error Message */}
              {mapError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{mapError}</p>
                  <p className="text-xs text-red-500 mt-1">
                    You can still search manually or enter address details
                    below.
                  </p>
                </div>
              )}

              {/* Search Results */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 z-20 max-h-48 overflow-y-auto">
                  {suggestions.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-800 block">
                            {result.name.split(",").slice(0, 2).join(",")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {result.name}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Map */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Location on Map
            </label>
            <div
              ref={mapRef}
              className="h-48 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-gray-200 overflow-hidden shadow-inner"
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                  <p className="text-gray-500 text-sm">
                    Loading Interactive Map...
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click to select location
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Complete Address *
              </label>
              <textarea
                value={formData.addressLine}
                onChange={(e) =>
                  handleInputChange("addressLine", e.target.value)
                }
                placeholder="Enter complete address with area, city, state, and pincode"
                rows="3"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nearby Landmark (Optional)
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => handleInputChange("landmark", e.target.value)}
                placeholder="e.g., Near Metro Station, Opposite Mall, Behind School"
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg border border-green-200">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => handleInputChange("isDefault", e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 transition-all"
            />
            <label
              htmlFor="isDefault"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Set as my default delivery address
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddressModal(false)}
              className="flex-1 px-6 py-3 text-sm border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-white rounded-lg transition-all transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAddress}
              disabled={
                !formData.name.trim() ||
                !formData.phone.trim() ||
                !formData.addressLine.trim()
              }
              className="flex-1 px-6 py-3 text-sm bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg font-medium"
            >
              {editingAddress ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
