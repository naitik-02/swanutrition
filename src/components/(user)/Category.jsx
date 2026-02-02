"use client";
import React, { useEffect, useState, useRef } from "react"; // ✅ useRef import kiya
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Productcard from "./productcard";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProductContext } from "@/context/product";

const Category = ({ topCategories = [] }) => {
  const { fetchHomepageProducts, homepageProducts } = useProductContext();
  const [loading, setLoading] = useState(false);

  // ✅ useRef properly imported and used
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!topCategories || topCategories.length === 0) return;
    if (fetchedRef.current) return; 
    
    const slugs = topCategories.slice(0, 3).map((cat) => cat.slug);
    
   
    const hasExistingData = slugs.some(slug => 
      homepageProducts[slug] && homepageProducts[slug].length > 0
    );
    
    if (hasExistingData) {
      fetchedRef.current = true; // Mark as fetched to prevent future calls
      return;
    }

    // Only fetch if we don't have data
    setLoading(true);
    fetchHomepageProducts(slugs)
      .then(() => {
        fetchedRef.current = true; // ✅ Mark as fetched
      })
      .catch((error) => {
        console.error("Error fetching homepage products:", error);
        fetchedRef.current = false; // Allow retry on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [topCategories, fetchHomepageProducts, homepageProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  const categoriesWithProducts = topCategories
    .slice(0, 6)
    .filter((category) => homepageProducts[category.slug]?.length > 0);

  if (categoriesWithProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products available in these categories.</p>
      </div>
    );
  }

  return (
    <>
      <div className="">
        {categoriesWithProducts.map((category) => {
          const categoryProductList = homepageProducts[category.slug] || [];

          return (
            <div key={category._id} className="mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
                    {category.name}
                  </h2>
                  
                </div>
                <Link
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-1 text-lg font-semibold text-pink-600 hover:text-blue-500 transition-all duration-200 group"
                >
                  See All
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Link>
              </div>

              {/* Products Swiper */}
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                navigation
                breakpoints={{
                  320: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                  },
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                  },
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 15,
                  },
                  768: {
                    slidesPerView: 4,
                    spaceBetween: 15,
                  },
                  1024: {
                    slidesPerView: 6,
                    spaceBetween: 15,
                  },
                  1280: {
                    slidesPerView: 7,
                    spaceBetween: 15,
                  },
                }}
  //                onReachBeginning={(swiper) => {
  //   // hide prev arrow when on first slide
  //   swiper.navigation.prevEl.style.display = "none";
  //   swiper.navigation.nextEl.style.display = "flex";
  // }}
  // onReachEnd={(swiper) => {
  //   // hide next arrow when on last slide
  //   swiper.navigation.nextEl.style.display = "none";
  //   swiper.navigation.prevEl.style.display = "flex";
  // }}
  // onFromEdge={(swiper) => {
  //   // when moving away from edges, show both again
  //   swiper.navigation.nextEl.style.display = "flex";
  //   swiper.navigation.prevEl.style.display = "flex";
  // }}

                className="w-full my-swiper"
              >
                {categoryProductList.map((product) => (
                  <SwiperSlide key={product._id || product.id}>
                    <Productcard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          );
        })}
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

export default Category;