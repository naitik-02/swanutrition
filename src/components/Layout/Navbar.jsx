'use client'
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function BlinkitNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-red-400 via-red-300 to-yellow-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
Freecart            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className="text-gray-900 hover:text-gray-700 font-semibold text-base transition-colors duration-200"
            >
              Home
            </a>
            <a 
              href="#about" 
              className="text-gray-900 hover:text-gray-700 font-semibold text-base transition-colors duration-200"
            >
              About
            </a>
            <a 
              href="#careers" 
              className="text-gray-900 hover:text-gray-700 font-semibold text-base transition-colors duration-200"
            >
              Careers
            </a>
            <a 
              href="#partner" 
              className="text-gray-900 hover:text-gray-700 font-semibold text-base transition-colors duration-200"
            >
              Partner
            </a>
            <a 
              href="#blog" 
              className="text-gray-900 hover:text-gray-700 font-semibold text-base transition-colors duration-200"
            >
              Blog
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-yellow-300 border-t border-yellow-500">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#home"
              className="block px-3 py-2 text-gray-900 hover:bg-yellow-400 font-semibold rounded-md transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#about"
              className="block px-3 py-2 text-gray-900 hover:bg-yellow-400 font-semibold rounded-md transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#careers"
              className="block px-3 py-2 text-gray-900 hover:bg-yellow-400 font-semibold rounded-md transition-colors duration-200"
            >
              Careers
            </a>
            <a
              href="#partner"
              className="block px-3 py-2 text-gray-900 hover:bg-yellow-400 font-semibold rounded-md transition-colors duration-200"
            >
              Partner
            </a>
            <a
              href="#blog"
              className="block px-3 py-2 text-gray-900 hover:bg-yellow-400 font-semibold rounded-md transition-colors duration-200"
            >
              Blog
            </a>
          </div>
        </div>
      )}


    </nav>
  );
}