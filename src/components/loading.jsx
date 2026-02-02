"use client";
import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Wave bouncing dots */}
        <div className="flex items-center justify-center space-x-2 h-12">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-wave"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-wave" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-wave" style={{ animationDelay: "0.2s" }}></div>
        </div>
        
        {/* Brand name */}
        <p className="mt-2 text-sm font-semibold text-gray-900 tracking-wide">FREECART</p>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;