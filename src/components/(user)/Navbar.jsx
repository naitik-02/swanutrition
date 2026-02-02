"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  MapPin,
  Clock,
  Store,
  Navigation,
  Loader2,
  Mic,
  MicOff,
} from "lucide-react";
import Image from "next/image";
import Menudropdown from "./Menudropdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopHeader from "./TopHeader";
import { useSettingContext } from "@/context/setting";
import { useUser } from "@/context/user";
import { useCart } from "@/context/cart";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Navbar = ({onCartClick}) => {
  const { user, isAuth, loading, logoutUser } = useUser();
  const router = useRouter();
  const { cart } = useCart();
  

  const { setting } = useSettingContext();

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const searchSuggestions = ["bread", "eggs", "snacks", "milk", "butter", "tea"];

  const [currentLocation, setCurrentLocation] = useState({
    address: "Boring Road, Patna",
    district: "Patna",
    state: "Bihar",
    pincode: "800001",
  });

  // Search suggestions rotation
  useEffect(() => {
    if (searchQuery === "") {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % searchSuggestions.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [searchQuery]);

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const toggleLocationPopup = () => {
    setIsLocationPopupOpen(!isLocationPopupOpen);
    if (!isLocationPopupOpen) {
      setSuggestions([]);
      setLocationQuery("");
    }
  };

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

  const fetchLocationSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ", India"
        )}&limit=5&addressdetails=1`
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

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
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

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const locationData = await reverseGeocode(latitude, longitude);

        if (locationData && locationData.display_name) {
          const locationDetails = extractLocationDetails(
            locationData.display_name
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

          setCurrentLocation({
            address: cleanAddress,
            deliveryTime: "8-12 mins",
            district:
              address?.city || address?.town || locationDetails.district,
            state: address?.state || locationDetails.state,
            pincode: address?.postcode || locationDetails.pincode,
          });
        } else {
          setCurrentLocation({
            address: "Current Location",
            deliveryTime: "8-12 mins",
            district: "Detected",
            state: "India",
            pincode: "000000",
          });
        }

        setIsLocationPopupOpen(false);
        setLoadingLocation(false);
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

        alert(errorMessage);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleLocationSelect = (selectedLocation) => {
    const locationDetails = extractLocationDetails(selectedLocation.name);

    const addressParts = selectedLocation.name.split(",").slice(0, 2);
    const cleanAddress = addressParts.join(",").trim();

    const estimatedDeliveryTime = Math.floor(Math.random() * 10) + 8;

    setCurrentLocation({
      address: cleanAddress,
      deliveryTime: `${estimatedDeliveryTime} mins`,
      district:
        selectedLocation.address?.city ||
        selectedLocation.address?.town ||
        locationDetails.district,
      state: selectedLocation.address?.state || locationDetails.state,
      pincode: selectedLocation.address?.postcode || locationDetails.pincode,
    });

    setSuggestions([]);
    setLocationQuery("");
    setIsLocationPopupOpen(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLocationSuggestions(locationQuery);
    }, 500);

    return () => clearTimeout(delay);
  }, [locationQuery]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        const params = new URLSearchParams();
        params.set("q", searchQuery.trim());
        router.push(`/search?${params.toString()}`);
      }
    }, 200);

    return () => clearTimeout(delay);
  }, [searchQuery, router]);

  // Voice Search Implementation
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Handle voice search toggle
  const handleVoiceSearch = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: false,
        language: "en-IN",
      });
    }
  };

  // Update search query when transcript changes
  useEffect(() => {
    if (transcript && transcript.trim() !== "") {
      setSearchQuery(transcript);
    }
  }, [transcript]);

  // Handle manual search query change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value === "") {
      resetTranscript();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser doesn't support speech recognition");
  }

  return (
    <div className="">
      <nav className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-4 lg:px-4">
          {/* Main Top Row - Logo, Location (mobile & desktop), Cart, Account */}
          <div className="flex justify-between items-center h-14 md:h-20 lg:h-20 gap-1">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href={"/"}>
                <Image
                  src={
                    setting?.logo && setting.logo.trim() !== ""
                      ? setting.logo
                      : "/default-logo.png"
                  }
                  alt="Logo"
                  width={40}
                  height={40}
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg object-cover"
                />
              </Link>
            </div>

            {/* Mobile Location - Shows only on mobile */}
            <div className="flex md:hidden items-center flex-1 min-w-0 justify-center">
              <button
                onClick={toggleLocationPopup}
                className="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-50 transition group max-w-full"
              >
                <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                <div className="flex flex-col justify-center text-left min-w-0">
                  <span className="text-xs font-semibold text-gray-900 truncate">
                    Quick Delivery
                  </span>
                  <span className="text-[10px] text-gray-500 truncate">
                    {currentLocation.address}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-gray-500 group-hover:text-gray-700 flex-shrink-0" />
              </button>
            </div>

            {/* Desktop Location - Shows only on desktop */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <button
                onClick={toggleLocationPopup}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition group"
              >
                <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex flex-col justify-center text-left">
                  <span className="text-sm font-semibold text-gray-900 truncate max-w-[250px]">
                    Quick Delivery
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-[280px]">
                    {currentLocation.address}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700 flex-shrink-0" />
              </button>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-2xl h-full items-center justify-center px-2">
              <div className="relative flex items-center bg-gray-50 border-1 border-gray-200 rounded-full w-full max-w-lg h-12 md:h-12 lg:h-12 focus-within:border-green-500 focus-within:bg-white transition-all duration-200">
                <div className="flex items-center justify-center w-10 h-full">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="flex-1 bg-transparent text-sm placeholder-gray-500 focus:outline-none"
                  placeholder="Search for products, categories"
                />

                {searchQuery === "" && (
                  <div className="absolute right-12 text-gray-400 text-sm pointer-events-none">
                    "{searchSuggestions[currentIndex]}"
                  </div>
                )}

                {browserSupportsSpeechRecognition && (
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`flex items-center justify-center w-10 h-full transition-all ${
                      listening
                        ? "text-red-500"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    title={listening ? "Stop listening" : "Start voice search"}
                  >
                    {listening ? (
                      <MicOff className="h-4 w-4 animate-pulse" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Right Section - Cart & Account */}
       <div  className="flex  items-center gap-1 md:gap-2 h-full flex-shrink-0">
              {/* Seller Button */}
              <Link href="/seller">
                <button className="flex items-center gap-2 px-3 md:px-4 h-9 md:h-12 bg-gradient-to-r from-orange-50 to-pink-300 hover:from-pink-300 hover:to-orange-50 text-black-600 hover:text-gray-900 cursor-pointer hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <Store strokeWidth={2} className="h-4  w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline text-sm font-bold">Seller</span>
                </button>
              </Link>

              {/* Cart */}
            {cart?.items?.length > 0 ? (
  <>
    {/* Small screen - Icon with badge */}
    <button onClick={onCartClick} className="sm:hidden relative flex items-center justify-center w-10 h-10 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all duration-200">
       <ShoppingCart className="h-6 w-6" />
       <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
        {cart?.totalItems}
      </span>
    </button>
    
    {/* Medium/Large screen - Full details */}
    <button onClick={onCartClick} className="hidden sm:flex relative cursor-pointer gap-2 items-center bg-orange-600 justify-center px-3 md:px-4 h-9 md:h-12 text-white hover:bg-orange-500 rounded-lg transition-all duration-200">
       <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-white flex-shrink-0" />
       <span className="text-white font-bold text-xs md:text-sm whitespace-nowrap">
         {cart?.totalItems} items <br />₹{cart?.totalAmount}

       </span>
     
    </button>
    </>
  
) : (
  <>
    <button
      disabled
      className="sm:hidden relative flex items-center justify-center w-10 h-10 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
    >
      <ShoppingCart className="h-6 w-6" />
    </button>
    
    <button
      disabled
      className="hidden sm:flex relative gap-2 items-center justify-center px-3 md:px-4 h-9 md:h-12 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
    >
      <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
      <span className="font-bold text-xs md:text-sm">My Cart</span>
    </button>
  </>
)}
              {/* Account */}
              <div className="relative h-full flex items-center">
                {!loading && isAuth ? (
                  <button
                    onClick={toggleAccountDropdown}
                    className="flex items-center gap-2 px-1 md:px-3 h-9 md:h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700">
                        Account
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.phone}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden lg:block" />
                  </button>
                ) : (
                  <Link href={"/auth/login"}>
                    <button className="flex items-center px-2 md:px-4 h-9 md:h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
                      <span className="text-xs md:text-base font-bold text-gray-700">
                        Login
                      </span>
                    </button>
                  </Link>
                )}
                {isAccountDropdownOpen && (
                  <Menudropdown
                    user={user}
                    logoutUser={logoutUser}
                    setIsAccountDropdownOpen={setIsAccountDropdownOpen}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden px-2 sm:px-4 pb-3 pt-2">
          <div className="relative flex items-center bg-gray-50 border-1 border-gray-200 rounded-full  h-10 focus-within:border-green-500 focus-within:bg-white transition-all duration-200">
            <div className="flex items-center justify-center w-10 h-full">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 bg-transparent text-sm placeholder-gray-500 focus:outline-none"
              placeholder="Search for products, brands and more..."
            />
            {browserSupportsSpeechRecognition && (
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`flex items-center justify-center w-10 h-full rounded-r-full transition-colors ${
                  listening
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {listening ? (
                  <MicOff className="h-4 w-4 animate-pulse" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Location Popup */}
        {isLocationPopupOpen && (
          <div className="absolute top-20 md:top-32 left-2 sm:left-4 z-50 w-96 max-w-[calc(100vw-16px)] bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Choose your location
            </h3>

            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-orange-50 rounded-md border border-gray-200">
              <div className="text-sm font-medium text-gray-800">
                {currentLocation.address}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {currentLocation.district}, {currentLocation.state} -{" "}
                {currentLocation.pincode}
              </div>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Search your area, city, pincode..."
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {isLoadingSuggestions && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 text-gray-400 animate-spin" />
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {suggestions.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-3 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-800 line-clamp-1">
                          {location.name.split(",").slice(0, 2).join(",")}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {location.name}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleCurrentLocation}
              disabled={loadingLocation}
              className="w-full text-sm flex items-center justify-center space-x-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              <span>
                {loadingLocation
                  ? "Detecting location..."
                  : "Use my current location"}
              </span>
            </button>
          </div>
        )}

        {/* Backdrop Overlay */}
        {(isAccountDropdownOpen || isLocationPopupOpen) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsAccountDropdownOpen(false);
              setIsLocationPopupOpen(false);
            }}
          />
        )}
      </nav>
    </div>
  );
};

export default Navbar;