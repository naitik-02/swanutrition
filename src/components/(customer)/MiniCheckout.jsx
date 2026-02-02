"use client";

import React from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/user";
import { useUI } from "@/context/uiContext";

const MiniCheckout = ({
  isOpen,
  onClose,
  cart,
  updateCartItem,
  removeFromCart,
  onProceedToCheckout,
  onProceedToLogin,
}) => {
  if (!isOpen) return null;

  const { setLoginOpen } = useUI();

  const deliveryCharge = 0;
  const handlingCharge = 0;
  const smallCartCharge = 0;
  const grandTotal =
    (cart?.totalAmount || 0) +
    deliveryCharge +
    handlingCharge +
    smallCartCharge;

  const { isAuth } = useUser();

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 overflow-y-auto top-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">My Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 ">
          {/* Delivery Time Badge */}
          {cart?.items && cart.items.length > 0 && (
            <div className="bg-green-50 border-b border-green-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-green-500">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Delivery in 30 minutes
                  </h3>
                  <p className="text-sm text-gray-600">
                    Shipment of {cart.items.length} item
                    {cart.items.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cart Items */}
          {!cart?.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <ShoppingCart size={64} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Add items to get started
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-4">
              {cart.items.map((item, index) => {
                const productId =
                  typeof item.productId === "object"
                    ? item.productId._id
                    : item.productId;
                const productSlug =
                  typeof item.productId === "object"
                    ? item.productId.slug
                    : null;

                return (
                  <div
                    key={index}
                    className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {item.image && productSlug ? (
                        <Link
                          href={`/details/${productSlug}`}
                          onClick={onClose}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                          />
                        </Link>
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{item.unit}</p>
                      <p className="text-base font-bold text-gray-900">
                        ₹{item.finalPrice}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(productId, item.unit)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                        <button
                          onClick={() =>
                            updateCartItem(productId, item.unit, "decrement")
                          }
                          className="p-1.5 hover:bg-gray-50 transition-colors rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} className="text-green-600" />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItem(productId, item.unit, "increment")
                          }
                          className="p-1.5 hover:bg-gray-50 transition-colors rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} className="text-green-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Bill Details */}
        {cart?.items && cart.items.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50">
            {/* Bill Details */}
            <div className="px-4 py-4 space-y-2 bg-white">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-sm">📋</span> Bill details
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <span className="text-xs">🛒</span> Items total
                  </span>
                  <span className="font-medium">₹{cart.totalAmount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <span className="text-xs">🚚</span> Delivery charge
                    <span
                      className="text-xs text-gray-400 cursor-help"
                      title="Standard delivery fee"
                    >
                      ⓘ
                    </span>
                  </span>
                  <span className="font-medium">₹{deliveryCharge}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <span className="text-xs">📦</span> Handling charge
                    <span
                      className="text-xs text-gray-400 cursor-help"
                      title="Packaging and handling"
                    >
                      ⓘ
                    </span>
                  </span>
                  <span className="font-medium">₹{handlingCharge}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <span className="text-xs">🛍️</span> Small cart charge
                    <span
                      className="text-xs text-gray-400 cursor-help"
                      title="Applied to orders under threshold"
                    >
                      ⓘ
                    </span>
                  </span>
                  <span className="font-medium">₹{smallCartCharge}</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Grand total</span>
                  <span className="font-bold text-lg">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-orange-50 border-t border-orange-100">
              <h4 className="text-xs font-semibold text-gray-900 mb-1">
                Cancellation Policy
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Orders cannot be cancelled once packed for delivery. In case of
                unexpected delays, a refund will be provided, if applicable.
              </p>
            </div>

            <div className="px-4 py-4 bg-white border-t border-gray-200">
              {isAuth ? (
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-between px-4"
                >
                  <span className="flex items-center gap-2">
                    <span>₹{grandTotal}</span>
                    <span className="text-xs font-normal opacity-90">
                      TOTAL
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span>Checkout to Proceed</span>
                    <ChevronRight size={20} />
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    setLoginOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-between px-4"
                >
                  <span className="flex items-center gap-2">
                    <span>₹{grandTotal}</span>
                    <span className="text-xs font-normal opacity-90">
                      TOTAL
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span>Login to Proceed</span>
                    <ChevronRight size={20} />
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </>
  );
};

export default MiniCheckout;
