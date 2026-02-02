"use client";
import React, { useEffect, useRef, useState } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";

const HomeHero = ({ data }) => {
  const swiperRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !data || data.length === 0) {
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
          loop: data.length > 1,
          slidesPerView: 1,
          spaceBetween: 0,
          speed: 600,
          autoplay:
            data.length > 1
              ? {
                  delay: 4500,
                  disableOnInteraction: false,
                }
              : false,
          pagination: {
            el: ".hero-pagination",
            clickable: true,
            bulletClass: "hero-bullet",
            bulletActiveClass: "hero-bullet-active",
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
              const activeSlide = this.slides[this.activeIndex];
              if (activeSlide) {
                const elements =
                  activeSlide.querySelectorAll(".animate-element");
                elements.forEach((el, index) => {
                  el.style.animationDelay = `${index * 0.15}s`;
                  el.classList.remove("slide-in");
                  el.offsetHeight;
                  el.classList.add("slide-in");
                });
              }
            },
          },
        });

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

        setTimeout(() => {
          const firstSlide = swiperElement.querySelector(
            ".swiper-slide-active"
          );
          if (firstSlide) {
            const elements = firstSlide.querySelectorAll(".animate-element");
            elements.forEach((el, index) => {
              el.style.animationDelay = `${index * 0.15}s`;
              el.classList.add("slide-in");
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
  }, [isMounted]);

  return (
    <div className="relative w-full mb-0">
      <div className="hero-swiper w-full h-50 md:h-120 rounded-sm overflow-hidden shadow-xl bg-slate-900 relative">
        <div className="swiper-wrapper">
          {data.map((slide, index) => (
            <div
              key={`slide-${slide._id || slide.id || index}`}
              className="swiper-slide relative cursor-pointer"
              onClick={() => router.push(slide.url)}
            >
              <div
                className="absolute inset-0 bg-cover bg-no-repeat bg-[50%_30%]"
                style={{ backgroundImage: `url(${slide.backgroundImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
              </div>

              <div className="relative z-10 h-full flex items-center px-6 sm:px-8 lg:px-12">
                <div className="max-w-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {data.length > 1 && (
          <>
            <button className=" hidden hero-btn-prev absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/5 hover:bg-white/30 backdrop-blur-xs rounded-full md:flex items-center justify-center transition-all duration-200 group">
              <svg
                className="w-3 h-3 text-white group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button className=" hidden hero-btn-next absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/5 hover:bg-white/30 backdrop-blur-xs rounded-full md:flex items-center justify-center transition-all duration-200 group">
              <svg
                className="w-3 h-3 text-white group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {data.length > 1 && (
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
