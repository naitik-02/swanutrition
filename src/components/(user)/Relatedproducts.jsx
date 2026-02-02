"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Productcard from "./productcard";


const Relatedproducts = ({products , heading}) => {
  return (
    <>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg  font-bold text-gray-800 tracking-tight">
            {heading}
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          navigation
          breakpoints={{
            320: {
              slidesPerView: 2,
            },
            480: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 6,
            },
            1280: {
              slidesPerView: 6,
            },
          }}
          className="w-full my-swiper"
        >
          {products.map((product , index) => (
            <SwiperSlide key={index}>
              <Productcard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <style jsx global>{`
        .my-swiper .swiper-button-next,
        .my-swiper .swiper-button-prev {
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 9999px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .my-swiper .swiper-button-next:hover,
        .my-swiper .swiper-button-prev:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }

         .my-swiper .swiper-button-disabled {
          opacity: 0;
          cursor: not-allowed;
        }

        .my-swiper .swiper-button-next::after,
        .my-swiper .swiper-button-prev::after {
          font-size: 16px;
        }
      `}</style>
    </>
  );
};

export default Relatedproducts;
