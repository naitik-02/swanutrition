"use client "
import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";


const CategorySlider = ({ categories, selectedCategory, onCategorySelect }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      return () => slider.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? sliderRef.current.scrollLeft - scrollAmount
        : sliderRef.current.scrollLeft + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full  rounded-xl">
  
      <button
        onClick={() => scroll('left')}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 ${
          !canScrollLeft ? 'opacity-0 cursor-not-allowed' : 'hover:scale-110'
        }`}
        disabled={!canScrollLeft}
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

    
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide  py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => onCategorySelect(category.slug)}
            className="group cursor-pointer flex-shrink-0 w-[100px]"
          >
            <div
              className={`relative bg-white rounded-xl p-3 h-[120px] shadow-sm hover:shadow-xl transition-all duration-300 border-2 transform hover:-translate-y-1 ${
                selectedCategory === category.slug
                  ? "border-orange-400 ring-2 ring-orange-200"
                  : "border-gray-100 hover:border-orange-200"
              }`}
            >
              <div className="relative w-full h-12 aspect-square mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform transition-all duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='12' fill='%23a0a0a0'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              <div className="text-center">
                <h4
                  className={`text-xs font-semibold transition-colors duration-300 leading-tight ${
                    selectedCategory === category.slug
                      ? "text-orange-600"
                      : "text-gray-700 group-hover:text-orange-600"
                  }`}
                >
                  {category.name}
                </h4>
                <div
                  className={`h-0.5 mx-auto mt-2 transition-all duration-300 rounded-full ${
                    selectedCategory === category.slug
                      ? "w-8 bg-orange-500"
                      : "w-0 bg-gradient-to-r from-orange-400 to-pink-400 group-hover:w-8"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 ${
          !canScrollRight ? 'opacity-0 cursor-not-allowed' : 'hover:scale-110'
        }`}
        disabled={!canScrollRight}
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export default CategorySlider