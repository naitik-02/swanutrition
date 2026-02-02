"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, Eye, ShoppingBag } from "lucide-react";

const VideoProductCard = ({ product , onOpen }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">

     
        <div
        onClick={()=>onOpen(product)}
        className="relative aspect-[3/4] bg-black overflow-hidden">

          <video
            src={product.video}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />

          {product.isLive && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
              LIVE
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 text-white text-[6px] px-2 py-1 rounded-md">
            <Eye size={6} />
            {product.views}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-3">
            <button className="   text-white  flex items-center transition">
              <Heart size={12} />
            </button>
            <button className="  text-white  flex items-center justify-center ">
              <Share2 size={12} />
            </button>
          </div>
        </div>

      {/* Product Info */}
      <div className="flex gap-3 p-2 items-center">
        <div className="relative w-6 h-6 rounded-lg overflow-hidden border">
          <Image
            src={product.product.images[0]}
            alt={product.product.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 gap-0">
          <h3 className="text-[8px] font-medium text-gray-800 line-clamp-2">
            {product.product.title}
          </h3>
          <p className="text-[8px] font-bold text-slate-900 mt-1">
            ₹{product.product.units[0].finalPrice}
          </p>
        </div>
      </div>
      <Link href={`/details/${product.product.slug}/`}>
       <button
             
              className="w-full py-2 rounded-lg font-semibold text-[8px] transition-all duration-200 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-sm"
              
            >
              <ShoppingBag size={10} />
              {"Buy Now"}
            </button>
      </Link>
      
    </div>
  );
};

export default VideoProductCard;
