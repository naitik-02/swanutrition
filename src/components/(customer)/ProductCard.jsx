"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { useUser } from "@/context/user";
import { ShoppingBag, Minus, Plus } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart, updateCartItem, cart, loading } = useCart();
  const [adding, setAdding] = useState(false);
  const { isAuth } = useUser();

  const cartItem = useMemo(() => {
    const items = cart?.items || [];
    if (!items.length || !product?._id) return null;

    return items.find((item) => {
      let itemProductId;
      if (typeof item.productId === "object" && item.productId._id) {
        itemProductId = item.productId._id.toString();
      } else {
        itemProductId = item.productId?.toString();
      }

      const currentProductId = product._id?.toString();
      const currentUnit = product.units[0]?.unit;
      const isMatch =
        itemProductId === currentProductId && item.unit === currentUnit;

      return isMatch;
    });
  }, [cart?.items, product._id, product.units]);

  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || loading) return;

    setAdding(true);
    try {
      await addToCart({
        product,
        unit: product.units[0].unit,
      });
      setTimeout(() => {
        setAdding(false);
      }, 500);
    } catch (err) {
      console.error("Add to cart error:", err);
      setAdding(false);
    }
  };

  const handleUpdateCart = async (action) => {
    if (loading) return;
    try {
      await updateCartItem(product._id, product.units[0].unit, action);
    } catch (err) {
      console.error("Update cart error:", err);
    }
  };

  const showQuantityControls = isInCart && !adding;
  const hasDiscount = product.units[0]?.discount > 0;
  const savingsAmount = product.units[0]?.price - product.units[0]?.finalPrice;

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
      <Link
        href={`/details/${product.slug}`}
        className="block flex-shrink-0"
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-contain p-3 transition-all duration-500 group-hover:scale-105"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 z-10">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-full shadow-lg">
                <span className="text-xs font-bold">
                  {product.units[0].discount}% OFF
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-grow p-3">
        <Link href={`/details/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug hover:text-slate-700 transition-colors line-clamp-2 h-10 mb-1">
            {product.title}
          </h3>
        </Link>

        {/* Description - Fixed 1 line */}
       <p
  className="text-xs text-gray-500 line-clamp-1 h-4 mb-2"
  dangerouslySetInnerHTML={{ __html: product?.description || "" }}
/>

        {/* Unit Badge */}
        <div className="mb-2">
          <span className="inline-flex text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
            {product.units[0].unit}
          </span>
        </div>

        {/* Price Section - Push to bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="text-lg font-bold text-slate-900">
              ₹{product.units[0].finalPrice}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.units[0].price}
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  Save ₹{savingsAmount}
                </span>
              </>
            )}
          </div>

          {/* Add to Cart / Quantity Controls */}
          {showQuantityControls ? (
            <div
              onClick={(e) => e.preventDefault()}
              className="flex items-center justify-between bg-slate-900 rounded-lg p-0.5"
            >
              <button
                onClick={() => handleUpdateCart("decrement")}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-slate-700 rounded-md transition-all cursor-pointer active:scale-95"
                disabled={loading}
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
              <span className="px-3 font-bold text-white text-sm min-w-[2.5rem] text-center">
                {loading ? "..." : cartQuantity}
              </span>
              <button
                onClick={() => handleUpdateCart("increment")}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-slate-700 rounded-md transition-all cursor-pointer active:scale-95"
                disabled={loading}
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="w-full py-2 rounded-lg font-semibold text-xs transition-all duration-200 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              disabled={adding || loading}
            >
              <ShoppingBag size={14} />
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;