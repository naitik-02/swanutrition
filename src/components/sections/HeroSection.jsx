"use client";
import React, { useEffect, useRef } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroSection = ({ fields }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!fields || fields.length === 0) return;

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true);
      swiperRef.current = null;
    }

    const init = () => {
      const swiperElement = document.querySelector(".hero-swiper");

      if (!swiperElement) return requestAnimationFrame(init);

      swiperRef.current = new Swiper(".hero-swiper", {
        loop: fields.length > 1,
        slidesPerView: 1,
        speed: 600,
        autoplay:
          fields.length > 1
            ? {
                delay: 4500,
                disableOnInteraction: false,
              }
            : false,
        pagination: {
          el: ".hero-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".hero-btn-next",
          prevEl: ".hero-btn-prev",
        },
        effect: "fade",
        fadeEffect: { crossFade: true },
      });
    };

    setTimeout(() => requestAnimationFrame(init), 80);

    return () => {
      swiperRef.current?.destroy(true, true);
      swiperRef.current = null;
    };
  }, [fields]);

  return (
    <div className="relative w-full">
      <div className="hero-swiper w-full h-64 md:h-96  overflow-hidden relative">
        <div className="swiper-wrapper">
          {fields.map((item, i) => (
            <div key={i} className="swiper-slide relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center px-6 md:px-12">
                <div className="max-w-xl space-y-4">
                  <h1 className="text-2xl md:text-4xl text-white font-extrabold animate-fadeup">
                    {item.heading}
                  </h1>

                  <p className="text-sm md:text-lg text-gray-300 animate-fadeup delay-150">
                    {item.paragraph}
                  </p>

                  {item.button && (
                    <a
                      href={item.buttonLink || "#"}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md animate-fadeup delay-300"
                    >
                      {item.button}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {fields.length > 1 && (
          <>
            <button className="hero-btn-prev absolute left-3 top-1/2 -translate-y-1/2 text-white">
              ‹
            </button>
            <button className="hero-btn-next absolute right-3 top-1/2 -translate-y-1/2 text-white">
              ›
            </button>

            <div className="hero-pagination absolute bottom-4 left-1/2 -translate-x-1/2"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
