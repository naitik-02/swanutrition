"use client"
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BlogCard from './BlogCard';

const BlogSection = ({data}) => {
 

  return (
    <div className='min-h-[400px] flex flex-col mb-10 lg:flex-row gap-8 lg:gap-24 px-6 md:px-12 lg:px-20 py-10 bg-slate-900'>
      <div className='w-full lg:w-1/3 flex flex-col justify-center'>
        <h3 className='font-extrabold text-2xl md:text-[32px] text-white leading-[1.2] tracking-tight mb-8'>
          Sahi nutrition ki samajh,<br /> 
          <span className='text-gray-600 text-3xl md:text-5xl'>ek swasth jeevan ki shuruat.</span>
        </h3>
        
        <div className='flex gap-3'>
          <button className='blog-swiper-button-prev w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group'>
            <svg className='w-5 h-5 text-white group-hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </button>
          <button className='blog-swiper-button-next w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer group'>
            <svg className='w-5 h-5 text-black group-hover:text-black' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Section - Swiper */}
      <div className='w-full lg:w-2/3'>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          navigation={{
            prevEl: '.blog-swiper-button-prev',
            nextEl: '.blog-swiper-button-next',
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
          }}
          className="w-full blog-swiper"
        >
          {data.map((blog) => (
            <SwiperSlide key={blog._id}>
              <BlogCard blog={blog}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default BlogSection