'use client'

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const Allcategories = ({ topCategories }) => {
  const [visibleCategories, setVisibleCategories] = useState(topCategories);

  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;

      if (width < 768) {
        // small screen (sm < 768px)
        setVisibleCategories(topCategories.slice(0, 12));
      } else if (width < 1024) {
        // medium screen (md < 1024px)
        setVisibleCategories(topCategories.slice(0, 12));
      } else {
        // large screen and above
        setVisibleCategories(topCategories);
      }
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);

    return () => window.removeEventListener("resize", updateVisible);
  }, [topCategories]);

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          All Categories
        </h2>
        <a
          href="/categories"
          className="flex items-center gap-1 text-lg font-semibold text-pink-600 hover:text-blue-500 transition-all duration-200"
        >
          See All <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-[16px]">
        {visibleCategories?.map((category, index) => (
          <a key={index} href={`/category/${category.slug}`}>
            <div className="group cursor-pointer relative h-full">
              <div className="relative bg-white rounded-sm p-4 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 h-full flex flex-col">
                <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="relative text-center flex-grow flex flex-col justify-center min-h-[3rem]">
                  <h4 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 mb-1 line-clamp-2 leading-tight">
                    {category.name}
                  </h4>
                  <div className="w-0 h-0.5 bg-gradient-to-r from-green-500 to-orange-500 mx-auto transition-all duration-300 group-hover:w-8"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse rounded-2xl transition-opacity duration-500"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transform scale-95 group-hover:scale-105 transition-all duration-500 -z-10"></div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Allcategories;
