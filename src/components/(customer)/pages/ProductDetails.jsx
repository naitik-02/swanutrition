"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Shield,
  Truck,
  Heart,
  Star,
  Lock,
} from "lucide-react";
import Selecttabs from "@/components/(customer)/Selecttabs";
import DetailsTab from "@/components/(customer)/DetailsTab";
import ProductsSlider from "@/components/(customer)/ProductsSlider";

import axios from "axios";
import Loading from "@/components/loading";
import { useCart } from "@/context/cart";

const ProductDetails = ({ slug }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
    const [updating, setUpdating] = useState(false);

  const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);

  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { addToCart, cart, updateCartItem } = useCart();

  const imageRef = useRef(null);
  const thumbnailRef = useRef(null);

  const fetchProduct = async (slug) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/User/products/fetchProduct/${slug}`,
      );
      setProduct(data?.product);
      setSimilarProducts(data?.similarProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCartItem = () => {
    if (!cart?.items || !product?._id || !product?.units) return null;

    const selectedUnitData = product.units[selectedUnit];
    const currentUnit = selectedUnitData?.unit;

    if (!currentUnit) return null;

    return cart.items.find((item) => {
      let itemProductId;
      if (typeof item.productId === "object" && item.productId._id) {
        itemProductId = item.productId._id.toString();
      } else {
        itemProductId = item.productId?.toString();
      }

      const currentProductId = product._id?.toString();
      const productIdMatch = itemProductId === currentProductId;
      const unitMatch = item.unit === currentUnit;
      return productIdMatch && unitMatch;
    });
  };

  const cartItem = getCartItem();
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  useEffect(() => {
    if (slug) fetchProduct(slug);
  }, [slug]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current || isMobile) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const nextSlide = () => {
    if (activeIndex < (product?.images?.length || 0) - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = isMobile ? 80 : 100;
      thumbnailRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const handleAddToCart = async (product) => {
    const selectedUnitData = product.units[selectedUnit];
    const currentUnit = selectedUnitData?.unit;

    if (currentUnit) {
      setAdding(true);
      await addToCart({ product, unit: currentUnit });
      setAdding(false);
    }
  };

  const updateCartItemCall = (action) => {
    const selectedUnitData = product.units[selectedUnit];
    const currentUnit = selectedUnitData?.unit;

    if (currentUnit) {
      setUpdating(true);
      updateCartItem(product._id, currentUnit, action).finally(() => {
        setUpdating(false);
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "FlashCart",
      text: "Check out this page on FlashCart!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert(
        "Sharing not supported on this browser. Try copying the link instead.",
      );
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen my-10 max-w-7xl m-auto px-5 md:px-20 ">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <div
                className="relative w-full aspect-square overflow-hidden"
                onMouseEnter={() => !isMobile && setIsZoomed(true)}
                onMouseLeave={() => !isMobile && setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                ref={imageRef}
              >
                <img
                  src={product?.images?.[activeIndex]}
                  alt={`Product - Image ${activeIndex + 1}`}
                  className={`w-full h-full object-contain p-8 transition-transform duration-300 ${
                    isZoomed && !isMobile ? "scale-150" : "scale-100"
                  }`}
                  style={
                    isZoomed && !isMobile
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : {}
                  }
                />

                {activeIndex > 0 && (
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 hover:scale-110"
                  >
                    <ChevronLeft size={20} className="text-slate-700" />
                  </button>
                )}

                {activeIndex < (product?.images?.length || 0) - 1 && (
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center transition-all hover:bg-slate-50 hover:scale-110"
                  >
                    <ChevronRight size={20} className="text-slate-700" />
                  </button>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  {activeIndex + 1} / {product?.images?.length || 0}
                </div>

                {/* Zoom Indicator */}
                {isZoomed && !isMobile && (
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    Zoom Active
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              {activeIndex > 0 && (
                <button
                  onClick={() => {
                    prevSlide();
                    scrollThumbnails("left");
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                >
                  <ChevronLeft size={16} className="text-slate-700" />
                </button>
              )}

              <div
                ref={thumbnailRef}
                className="flex gap-3 overflow-x-auto px-10 scroll-smooth scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {product?.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                      activeIndex === index
                        ? "border-slate-900 shadow-md scale-105"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {activeIndex < (product?.images?.length || 0) - 1 && (
                <button
                  onClick={() => {
                    nextSlide();
                    scrollThumbnails("right");
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                >
                  <ChevronRight size={16} className="text-slate-700" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {product?.brand?.name}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-600">
                  {product?.category?.name}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                {product?.title}
              </h1>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">(128 reviews)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Select Size
              </h3>

              <div className="flex flex-wrap gap-2">
                {product?.units?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedUnit(index)}
                    className={`relative px-3 py-2 border rounded-md transition-all duration-200 ${
                      selectedUnit === index
                        ? "border-slate-900 bg-slate-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-center space-y-0.5">
                      <div className="font-medium text-[13px] text-slate-900">
                        {option.unit}
                      </div>

                      <div className="text-[12px] text-slate-700">
                        {option.discount > 0 && (
                          <span className="line-through text-slate-400 mr-1">
                            {formatPrice(option.price)}
                          </span>
                        )}
                        <span className="font-semibold text-slate-900">
                          {formatPrice(option.finalPrice)}
                        </span>
                      </div>
                    </div>

                    {option.discount > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                        {option.discount}% OFF
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 border border-slate-200 rounded-md bg-white">
              <p className="text-sm font-medium text-slate-900 mb-2">
                Check delivery availability
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter pincode"
                  className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button className="px-3 py-2 text-sm font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition">
                  Check
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Delivery availability depends on your location
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-baseline gap-3">
                <div className="text-lg font-bold text-slate-900">
                  {formatPrice(
                    (product?.units?.[selectedUnit]?.finalPrice || 0) *
                      (isInCart ? cartQuantity : quantity),
                  )}
                </div>
                {isInCart && (
                  <div className="text-sm text-slate-600">
                    ({cartQuantity} {cartQuantity === 1 ? "item" : "items"} in
                    cart)
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {!isInCart ? (
                  <button
                      onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98]"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center bg-slate-100 border border-slate-900 rounded-md overflow-hidden">
                    <button
                          onClick={() => updateCartItemCall("decrement")}
                      className="p-2 hover:bg-slate-200 transition-colors"
                    >
                      <Minus size={14} className="text-slate-900" />
                    </button>

                    <div className="px-3 py-2 font-medium text-slate-900 min-w-[2.5rem] text-center text-sm">
                      {cartQuantity}
                    </div>
                    <button
                          onClick={() => updateCartItemCall("increment")}
                      className="p-2 hover:bg-slate-200 transition-colors"
                    >
                      <Plus size={14} className="text-slate-900" />
                    </button>
                  </div>
                )}

                <button className="flex-1 bg-white hover:bg-slate-50 border border-slate-900 text-slate-900 px-3 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-[0.98]">
                  <ShoppingCart size={16} />
                  Checkout
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-md border border-slate-200 hover:border-slate-300 bg-white transition-all duration-200 hover:bg-slate-50"
                >
                  <Share2 size={16} className="text-slate-700" />
                </button>
              </div>

              <div className="grid grid-cols-2  md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Shield className="text-slate-900" size={28} />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Lock className="text-slate-900" size={28} />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Shield className="text-slate-900" size={28} />
                  <span>
                    48 Hours <br /> Shipment
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Truck className="text-slate-900" size={28} />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div></div>
        <div className="my-10">
          <DetailsTab product={product} />
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div>
        <h1 className="text-center font-medium mb-10 text-3xl">
          You May Also Buy
        </h1>
        <ProductsSlider products={similarProducts} />
      </div>
    </div>
  );
};

export default ProductDetails;
