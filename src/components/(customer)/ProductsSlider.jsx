"use client";
import React, { useEffect, useState, useRef } from "react"; // ✅ useRef import kiya
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

const ProductsSlider = ({ products }) => {
  return (
    <>
      <div className="">
        <div className="">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            navigation
            grabCursor={true}
            allowTouchMove={true}
            simulateTouch={true}
            touchRatio={1}
            threshold={5}
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 12 },
              480: { slidesPerView: 1.5, spaceBetween: 12 },
              640: { slidesPerView: 3, spaceBetween: 15 },
              768: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 15 },
              1280: { slidesPerView: 4, spaceBetween: 15 },
            }}
            className="w-full my-swiper"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id || product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .my-swiper .swiper-button-next,
        .my-swiper .swiper-button-prev {
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          margin-top: 0;
          transform: translateY(-50%);
        }

        .my-swiper .swiper-button-next:hover,
        .my-swiper .swiper-button-prev:hover {
          background-color: rgba(0, 0, 0, 0.8);
          transform: translateY(-50%) scale(1.1);
        }

        .my-swiper .swiper-button-next::after,
        .my-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }

        .my-swiper .swiper-button-next {
          right: 10px;
        }

        .my-swiper .swiper-button-prev {
          left: 10px;
        }

        .my-swiper .swiper-button-disabled {
          opacity: 0;
          cursor: not-allowed;
        }

        /* Hide navigation on very small screens */
        @media (max-width: 640px) {
          .my-swiper .swiper-button-next,
          .my-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default ProductsSlider;
