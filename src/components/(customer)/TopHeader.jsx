'use client'
import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGeneral } from "@/context/generalContext";

const TopHeader = () => {
  const router = useRouter();
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const {
    fetchHeaderData,
    headerLoading,
    setHeaderLoading,
    headerData,
    setHeaderData,
  } = useGeneral();

  // Get offers from API data
  const offers = headerData?.offers?.items || [];

  useEffect(() => {
    if (offers.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
        setIsAnimating(false);
      }, 300);
    }, 4000); 

    return () => clearInterval(interval);
  }, [offers.length]);

  const handleOfferClick = (link) => {
    if (!link) return;
    
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      router.push(link);
    }
  };

  // Don't render if offers are not active or no offers available
  if (!headerData?.offers?.isActive || offers.length === 0) {
    return null;
  }

  const currentOffer = offers[currentOfferIndex];

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <div 
          onClick={() => handleOfferClick(currentOffer.url)}
          className="py-2.5 text-white text-sm flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span 
            className={`text-white font-medium text-xs md:text-sm text-center transition-all duration-300 ${
              isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
            style={{ color: currentOffer.color || '#ffffff' }}
          >
            {currentOffer.title}
          </span>
          
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Offer Indicator Dots */}
      {offers.length > 1 && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-1.5 pb-1">
          {offers.map((offer, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentOfferIndex(index);
                  setIsAnimating(false);
                }, 300);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentOfferIndex 
                  ? 'w-6 bg-white' 
                  : 'w-1.5 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to offer ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopHeader;