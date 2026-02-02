"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import VideoProductCard from "./VideoProductCard";
import ReelModal from "./ReelModal";

const VideoSlider = ({ products }) => {
  const [activeProduct, setActiveProduct] = useState(null);

  const handleOpenReel = async (product) => {
    setActiveProduct(product);

    try {
      const id = product?.video?._id || product?._id; 

      if (!id) return;

      await fetch(`/api/User/video/view/${id}`, {
        method: "PATCH",
      });
    } catch (error) {
      console.log("View increase error:", error);
    }
  };

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        navigation
        breakpoints={{
          320: { slidesPerView: 3, spaceBetween: 15 },
          480: { slidesPerView: 4, spaceBetween: 15 },
          640: { slidesPerView: 5, spaceBetween: 15 },
          768: { slidesPerView: 5, spaceBetween: 15 },
          1024: { slidesPerView: 7, spaceBetween: 15 },
          1280: { slidesPerView: 7, spaceBetween: 15 },
        }}
        className="w-full my-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id || product.id}>
            <VideoProductCard product={product} onOpen={handleOpenReel} />
          </SwiperSlide>
        ))}
      </Swiper>

      {activeProduct && (
        <ReelModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </>
  );
};

export default VideoSlider;
