"use client";
import React, { useEffect } from "react";
import { CheckCircle, Package, ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";
import { useOrder } from "@/context/order";
import { useCart } from "@/context/cart";
import Loading from "@/components/loading";

const OrderSuccess = () => {
  const { currentOrder } = useOrder();
  const { getCart } = useCart();

  useEffect(() => {
    getCart();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "paid":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!currentOrder) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Continue Shopping</span>
          </Link>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 animate-bounce">
                <CheckCircle className="w-16 h-16" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-green-50 text-base mb-6">
              Thank you for your purchase
            </p>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-5 py-3">
              <Receipt className="w-5 h-5" />
              <span className="font-mono font-semibold text-lg">
                #{currentOrder._id?.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="px-8 py-8">
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 justify-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    currentOrder.orderStatus,
                  )}`}
                >
                  {currentOrder.orderStatus?.charAt(0).toUpperCase() +
                    currentOrder.orderStatus?.slice(1)}
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(
                    currentOrder.paymentStatus,
                  )}`}
                >
                  {currentOrder.paymentStatus?.charAt(0).toUpperCase() +
                    currentOrder.paymentStatus?.slice(1)}
                </span>
              </div>

              {/* Order Info */}
              <div className="border-t border-b border-gray-200 py-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {currentOrder.totalItems || 0}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Items</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(currentOrder.totalAmount || 0)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Total</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 uppercase">
                      {currentOrder.paymentMethod === "COD"
                        ? "COD"
                        : currentOrder.paymentMethod}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Payment</div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Price Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({currentOrder.totalItems || 0} items)
                    </span>
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(currentOrder.finalAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (GST)</span>
                    <span className="text-gray-900">Included</span>
                  </div>
                  {currentOrder.couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Coupon Discount</span>
                      <span className="text-green-600 font-medium">
                        - {formatCurrency(currentOrder.couponDiscount)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(currentOrder.finalAmount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Date */}
              <div className="text-center">
                <p className="text-sm text-gray-500">Order placed on</p>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {currentOrder.createdAt
                    ? formatDate(currentOrder.createdAt)
                    : "Just now"}
                </p>
              </div>

              {/* Expected Delivery */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-sm text-blue-900 font-medium">
                  Expected Delivery
                </p>
                <p className="text-lg font-bold text-blue-700 mt-1">
                  3-5 Business Days
                </p>
              </div>

              {/* COD Note */}
              {currentOrder.paymentMethod === "COD" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <p className="text-sm text-yellow-800">
                    💡 Please keep exact change ready for delivery
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="px-8 pb-8">
            <Link href="/" className="block">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>

        {/* Order Tracking Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You will receive order updates via email and SMS
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
