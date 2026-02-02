"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Tag,
  Loader2,
  MapPin,
  ShoppingCart,
  LogIn,
} from "lucide-react";
import CartAddress from "@/components/(user)/CartAddress";
import Payment from "@/components/(user)/Payment";
import { useSettingContext } from "@/context/setting";
import { usePaymentSettingsContext } from "@/context/storePayment";
import { useCart } from "@/context/cart";
import { useAddressContext } from "@/context/address";
import { useUI } from "@/context/uiContext";
import { useOrder } from "@/context/order";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/user";
import Loading from "@/components/loading";
import ApplyCoupon from "../ApplyCoupon";

const Checkout = () => {
  const { paymentSettings, fetchPaymentSettings } = usePaymentSettingsContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
    const { loginOpen, setLoginOpen } = useUI();
  

  const { isAuth, userLoading } = useUser();

  // ✅ FIX 1: Prevent multiple payment settings fetches
  const paymentFetchedRef = useRef(false);

  useEffect(() => {
    if (isAuth && !paymentFetchedRef.current) {
      paymentFetchedRef.current = true;
      fetchPaymentSettings();
    }
  }, [isAuth]);

  const router = useRouter();
  const { addresses, addAddress, updateAddress, fetchAddresses, loading } =
    useAddressContext();

  const { placeOrder } = useOrder();

  const { cart, getCart, updateCartItem, removeFromCart, cartLoading } =
    useCart();

  // ✅ FIX 2: Prevent redundant initialization and race conditions
  const initRef = useRef(false);

  useEffect(() => {
    if (userLoading) return; // Wait for user loading to complete

    // Only initialize once
    if (!initRef.current) {
      initRef.current = true;

      const initializeCheckout = async () => {
        try {
          if (isAuth) {
            await fetchAddresses();
          }
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
        } finally {
          setInitialLoading(false);
        }
      };

      initializeCheckout();
    }
  }, [userLoading, isAuth]);

  // ✅ FIX 3: Stable address selection (avoid infinite loops)
  useEffect(() => {
    if (!addresses || addresses.length === 0) return;

    // Only update if no address is selected
    if (!selectedAddress) {
      const defaultAddr = addresses.find((addr) => addr.isDefault);
      setSelectedAddress(defaultAddr || addresses[0]);
    }
  }, [addresses]);

  const deliveryCharge = 0;

  const handleCheckout = async () => {
    if (!isAuth) {
      alert("Please login to place an order");
      router.push("/login");
      return;
    }

    if (!selectedAddress) {
      alert("Please add a delivery address");
      return;
    }

    setIsPlacingOrder(true);
    try {
      await placeOrder(selectedAddress, paymentMethod);
      router.push("/order-success");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push("/auth/login");
  };

  const canPlaceOrder = isAuth && selectedAddress && cart?.items?.length > 0;

  if (userLoading || cartLoading || initialLoading) return <Loading />;

  return (
    <div className="min-h-screen   ">
      <div className="max-w-7xl m-auto px-5 md:px-20  my-10  ">
        <div className="mb-6 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-xs sm:xs text-gray-600">
            Review your order and complete your purchase
          </p>
        </div>

        {(!cart?.items || cart?.items?.length === 0) && (
          <div className="bg-white rounded-sm  border border-gray-200 p-8 sm:p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No items in cart yet
            </h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart to proceed with checkout
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {cart?.items && cart?.items?.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-7 space-y-6 order-1 ">
              <div className="bg-white rounded-sm  border border-gray-200 overflow-hidden">
                <div className="px-2 sm:px-4 py-3  border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Order Items ({cart?.items?.length})
                  </h2>
                </div>

                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {cart?.items?.map((item, index) => {
                    // ✅ FIX 4: Safe productId extraction
                    const productId =
                      typeof item.productId === "object"
                        ? item.productId._id
                        : item.productId;

                    return (
                      <div
                        key={`${productId}-${item.unit}-${index}`}
                        className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            {productId && item.image && (
                              <Link
                                href={`/details/${
                                  item.productId?.slug || productId
                                }`}
                                passHref
                              >
                                <img
                                  src={item.image}
                                  alt={item.title || "Product Image"}
                                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                                />
                              </Link>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.unit}
                            </p>
                            <p className="text-base sm:text-lg font-semibold text-orange-600 mt-1">
                              ₹{item.finalPrice.toLocaleString()}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  updateCartItem(productId, item.unit, "decrement")
                                }
                                className="cursor-pointer p-1.5 hover:bg-gray-100 transition-colors rounded-l-lg"
                                aria-label="Decrease quantity"
                                disabled={loading}
                              >
                                <Minus size={14} className="text-gray-600" />
                              </button>
                              <span className="px-2.5 py-1 text-sm text-center min-w-[40px] font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateCartItem(productId, item.unit, "increment")
                                }
                                className="cursor-pointer p-1.5 hover:bg-gray-100 transition-colors rounded-r-lg"
                                aria-label="Increase quantity"
                                disabled={loading}
                              >
                                <Plus size={14} className="text-gray-600" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(productId, item.unit)}
                              className="cursor-pointer p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Remove item"
                              disabled={loading}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-sm  border border-gray-200 overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Delivery Address <span className="text-red-500">*</span>
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  {!isAuth ? (
                    <div className="text-center py-8">
                      <LogIn size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Login Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please login to add and manage your delivery addresses
                      </p>
                      <button
                        onClick={() => setLoginOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                      >
                        <LogIn size={18} className="mr-2" />
                        Login Now
                      </button>
                    </div>
                  ) : !addresses || addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin
                        size={48}
                        className="mx-auto text-gray-400 mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No delivery address found
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please add a delivery address to continue
                      </p>
                      <CartAddress
                        addresses={addresses}
                        addAddress={addAddress}
                        updateAddress={updateAddress}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                      />
                    </div>
                  ) : (
                    <CartAddress
                      addresses={addresses}
                      addAddress={addAddress}
                      updateAddress={updateAddress}
                      selectedAddress={selectedAddress}
                      setSelectedAddress={setSelectedAddress}
                    />
                  )}
                </div>
              </div>

              {isAuth && (
                <div className="bg-white rounded-sm  border border-gray-200 overflow-hidden">
                  <div className="px-4 sm:px-6 py-4  border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Payment Method
                    </h2>
                  </div>

                  <Payment
                    paymentSettings={paymentSettings}
                    setPaymentMethod={setPaymentMethod}
                    paymentMethod={paymentMethod}
                  />
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6 order-2 ">
              <ApplyCoupon cart={cart} refreshCart={getCart} />

              <div className="bg-white rounded-sm border border-gray-200 sticky top-4">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="space-y-3 mb-6">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ₹{(cart?.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Delivery */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Charges</span>
                      <span className="font-medium">
                        {deliveryCharge === 0 ? (
                          <span className="text-green-600 font-semibold">
                            FREE
                          </span>
                        ) : (
                          <span className="text-gray-900">
                            ₹{deliveryCharge}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Discount */}
                    {(cart?.discountAmount || 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-semibold text-green-600">
                          - ₹{(cart?.discountAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total Payable */}
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">
                        Total Payable
                      </span>

                      <span className="text-2xl font-bold text-orange-600">
                        ₹
                        {(
                          (cart?.finalAmount ?? cart?.totalAmount ?? 0) +
                          deliveryCharge
                        ).toLocaleString()}
                      </span>
                    </div>

                    {/* small info line */}
                    {(cart?.discountAmount || 0) > 0 && (
                      <p className="text-xs text-green-700 mt-2">
                        You saved ₹
                        {(cart?.discountAmount || 0).toLocaleString()} on this
                        order 🎉
                      </p>
                    )}
                  </div>

                  {/* Place Order Button / Login */}
                  {!isAuth ? (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <LogIn size={20} className="text-blue-600 mr-3" />
                          <div>
                            <p className="text-blue-800 font-medium text-sm">
                              Login Required
                            </p>
                            <p className="text-blue-600 text-xs mt-1">
                              Please login to place your order
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setLoginOpen(true)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                        <LogIn size={20} className="mr-2" />
                        Login to Place Order
                      </button>
                    </div>
                  ) : canPlaceOrder ? (
                    <button
                      disabled={isPlacingOrder}
                      onClick={handleCheckout}
                      className="cursor-pointer w-full bg-gradient-to-r from-orange-600 to-green-600 text-white py-3.5 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg hover:shadow-xl"
                    >
                      {isPlacingOrder ? (
                        <>
                          <Loader2 size={20} className="animate-spin mr-2" />
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-sm font-medium mb-2">
                          Complete these steps to place order:
                        </p>
                        <ul className="text-yellow-700 text-xs space-y-1.5">
                          {!selectedAddress && (
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                              Add a delivery address
                            </li>
                          )}
                          {(!cart?.items || cart?.items?.length === 0) && (
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                              Add items to your cart
                            </li>
                          )}
                        </ul>
                      </div>

                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
                      >
                        Complete Requirements First
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                    By placing your order, you agree to our{" "}
                    <span className="text-gray-700 font-medium">
                      Terms & Conditions
                    </span>{" "}
                    and{" "}
                    <span className="text-gray-700 font-medium">
                      Privacy Policy
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;