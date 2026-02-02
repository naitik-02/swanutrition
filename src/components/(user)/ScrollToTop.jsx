"use client";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      
      setVisible(scrolled > 300);
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility(); // Initial check
    
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div 
      className={`fixed bottom-12 right-6 z-50 transition-all duration-300 transform ${
        visible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Progress Ring */}
      <div className="relative">
        <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
          {/* Background circle */}
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 24}`}
            strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
            className="transition-all duration-300 ease-out"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Main Button */}
        <button
          onClick={scrollToTop}
          className="absolute inset-1 bg-gradient-to-br from-orange-400 to-green-200 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 group backdrop-blur-sm border border-slate-700"
          aria-label="Scroll to Top"
        >
          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-black-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Icon container */}
          <div className="relative flex items-center justify-center w-full h-full">
            <ChevronUp 
              size={20} 
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" 
            />
          </div>

          {/* Pulse animation on hover */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
        </button>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute bottom-3 left-2 w-0.5 h-0.5 bg-purple-400 rounded-full animate-ping opacity-40 animation-delay-300"></div>
          <div className="absolute top-1/2 left-1 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse opacity-50 animation-delay-700"></div>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 pointer-events-none">
        Back to top
        <div className="absolute top-full right-3 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};

export default ScrollToTopButton;