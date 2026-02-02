"use client";
import React, { useEffect, useRef } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useHeroSliderContext } from "@/context/heroslider";
import { useRouter } from "next/navigation";

const HomeHero = () => {
  const { heroSliders, heroLoading } = useHeroSliderContext();
  const router = useRouter();
  const swiperRef = useRef(null);

  useEffect(() => {
    if (heroLoading || !heroSliders || heroSliders.length === 0) {
      return;
    }

    if (swiperRef.current) {
      swiperRef.current.destroy(true, true);
      swiperRef.current = null;
    }

    const initSwiper = () => {
      const swiperElement = document.querySelector(".hero-swiper");
      const swiperWrapper = document.querySelector(".swiper-wrapper");
      
      if (!swiperElement || !swiperWrapper) {
        requestAnimationFrame(initSwiper);
        return;
      }

      const slides = swiperWrapper.querySelectorAll(".swiper-slide");
      if (slides.length === 0) {
        requestAnimationFrame(initSwiper);
        return;
      }

      try {
        swiperRef.current = new Swiper(".hero-swiper", {
          loop: heroSliders.length > 1,
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 600,
          autoplay: heroSliders.length > 1 ? {
            delay: 4500,
            disableOnInteraction: false,
          } : false,
          pagination: {
            el: ".hero-pagination",
            clickable: true,
            bulletClass: 'hero-bullet',
            bulletActiveClass: 'hero-bullet-active',
          },
          navigation: {
            nextEl: ".hero-btn-next",
            prevEl: ".hero-btn-prev",
          },
          effect: "fade",
          fadeEffect: {
            crossFade: true,
          },
          observer: true,
          observeParents: true,
          on: {
            slideChangeTransitionEnd: function () {
              // Trigger animations on slide change
              const activeSlide = this.slides[this.activeIndex];
              if (activeSlide) {
                const elements = activeSlide.querySelectorAll('.animate-element');
                elements.forEach((el, index) => {
                  el.style.animationDelay = `${index * 0.15}s`;
                  el.classList.remove('slide-in');
                  el.offsetHeight; // Trigger reflow
                  el.classList.add('slide-in');
                });
              }
            },
          },
        });

        // Pause on hover
        swiperElement.addEventListener("mouseenter", () => {
          if (swiperRef.current?.autoplay) {
            swiperRef.current.autoplay.stop();
          }
        });

        swiperElement.addEventListener("mouseleave", () => {
          if (swiperRef.current?.autoplay) {
            swiperRef.current.autoplay.start();
          }
        });

        // Initial animation trigger
        setTimeout(() => {
          const firstSlide = swiperElement.querySelector('.swiper-slide-active');
          if (firstSlide) {
            const elements = firstSlide.querySelectorAll('.animate-element');
            elements.forEach((el, index) => {
              el.style.animationDelay = `${index * 0.15}s`;
              el.classList.add('slide-in');
            });
          }
        }, 100);

      } catch (error) {
        console.error("Error initializing Swiper:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(initSwiper);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [heroSliders, heroLoading]);

  if (heroLoading) {
    return (
      <div className="w-full h-60 bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse rounded-xl">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!heroSliders || heroSliders.length === 0) {
    return (
      <div className="w-full h-60 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300">
        <div className="flex items-center justify-center h-full text-slate-500">
          No slides available
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full mb-0">
      <div className="hero-swiper w-full h-50 md:h-80 rounded-sm overflow-hidden shadow-xl bg-slate-900 relative">
        <div className="swiper-wrapper">
          {heroSliders.map((slide, index) => (
            <div
              key={`slide-${slide._id || slide.id || index}`}
              className="swiper-slide relative"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center px-6 sm:px-8 lg:px-12">
                <div className="max-w-lg">
                  
                  {/* Badge */}
                  <div className="animate-element mb-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] font-bold rounded-full shadow-md">
                      <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {slide.discount}% OFF
                    </span>
                  </div>

                  {/* Title */}
                  <div className="animate-element mb-3">
                    <h1 className="text-sm sm:text-3xl lg:text-4xl font-extrabold  text-white leading-tight">
                      {slide.title}
                    </h1>
                  </div>

                  {/* Description */}
                  <div className="animate-element mb-6">
                    <div
                      className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-md"
                      dangerouslySetInnerHTML={{ __html: slide.description }}
                    />
                  </div>

                  {/* Button */}
                  <div className="animate-element">
                    <button
                      onClick={() => router.push(`/category/${slide.category.slug}`)}
                      className="group relative inline-flex items-center px-2 py-1.5     text-[14px] bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      Shop Now
                      <svg
                        className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        {heroSliders.length > 1 && (
          <>
            <button className=" hidden hero-btn-prev absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/5 hover:bg-white/30 backdrop-blur-xs rounded-full md:flex items-center justify-center transition-all duration-200 group">
              <svg className="w-3 h-3 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button className=" hidden hero-btn-next absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/5 hover:bg-white/30 backdrop-blur-xs rounded-full md:flex items-center justify-center transition-all duration-200 group">
              <svg className="w-3 h-3 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Pagination */}
        {heroSliders.length > 1 && (
          <div className="hero-pagination absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2"></div>
        )}
      </div>

      <style jsx>{`
        /* Pagination Bullets */
        .hero-bullet {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: rgba(255, 255, 255, 0.4) !important;
          opacity: 1 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          margin: 0 !important;
        }

        .hero-bullet:hover {
          background: rgba(255, 255, 255, 0.6) !important;
          transform: scale(1.2) !important;
        }

        .hero-bullet-active {
          background: linear-gradient(45deg, #f97316, #ea580c) !important;
          transform: scale(1.4) !important;
          box-shadow: 0 0 12px rgba(249, 115, 22, 0.5) !important;
        }

        /* Animations */
        .animate-element {
          opacity: 0;
          transform: translateY(30px);
        }

        .slide-in {
          animation: slideInUp 0.6s ease-out forwards;
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Hide default swiper elements */
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev,
        .hero-swiper .swiper-pagination {
          display: none !important;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .hero-bullet {
            width: 6px !important;
            height: 6px !important;
          }
          
          .hero-bullet-active {
            transform: scale(1.3) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeHero;