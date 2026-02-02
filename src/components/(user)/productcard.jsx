"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { useUser } from "@/context/user";
import { Clock } from "lucide-react";

const Productcard = ({ product }) => {
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

  return (
    <div className="group relative bg-white rounded-sm  transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full my-[1px]">
      <Link
        href={`/productdetails/${product.slug}`}
        className="block flex-shrink-0"
      >
        <div className="relative aspect-square overflow-hidden bg-white p-6">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />

          {product.units[0]?.discount > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-md shadow-md">
                {product.units[0].discount}% OFF
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content Container - Flexible Height */}
      <div className="flex flex-col flex-grow px-4 mt-3 pb-4">
       

        {/* Product Title - Fixed Height with Line Clamp */}
        <Link href={`/productdetails/${product.slug}`}>
          <h3 className="text-base text-[12px] text-gray-900 mb-2 leading-snug hover:text-orange-600 transition-colors min-h-[2rem]">
            {product.title.split(" ").length > 5
              ? product.title.split(" ").slice(0, 5).join(" ") + "..."
              : product.title}
          </h3>
        </Link>

        {/* Unit/Weight */}
        <p className="text-xs text-gray-500 mb-3">{product.units[0].unit}</p>

        {/* Price and Button Section */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              ₹{product.units[0].finalPrice}
            </span>
            {product.units[0].price !== product.units[0].finalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.units[0].price}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {showQuantityControls ? (
            <div
              onClick={(e) => e.preventDefault()}
              className="flex items-center border-2 border-green-600 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => handleUpdateCart("decrement")}
                className="w-8 h-8 flex items-center cursor-pointer justify-center text-green-600 hover:bg-green-50 font-bold transition-colors"
                disabled={loading}
              >
                −
              </button>
              <span className="px-3 font-bold text-green-600 min-w-[2rem] text-center">
                {loading ? "..." : cartQuantity}
              </span>
              <button
                onClick={() => handleUpdateCart("increment")}
                className="w-8 h-8 flex items-center cursor-pointer justify-center text-green-600 hover:bg-green-50 font-bold transition-colors"
                disabled={loading}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="px-4 py-2 rounded-lg cursor-pointer font-bold text-xs transition-all duration-200 border-2 border-green-600 text-green-600 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              disabled={adding || loading}
            >
              {adding ? "Adding..." : "ADD"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productcard;
