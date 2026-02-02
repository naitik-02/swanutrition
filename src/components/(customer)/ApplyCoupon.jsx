"use client";

import React, { useState } from "react";
import { Tag, X, Loader2 } from "lucide-react";

const ApplyCoupon = ({ cart, refreshCart }) => {
  const [couponCode, setCouponCode] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showMessage("error", "Please enter a coupon code");
      return;
    }

    try {
      setLoadingCoupon(true);

      const res = await fetch("/api/User/coupon/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.message || "Invalid coupon");
        return;
      }

      showMessage("success", data.message || "Coupon applied successfully");
      setCouponCode("");
      await refreshCart?.();
    } catch (error) {
      showMessage("error", "Something went wrong");
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setLoadingCoupon(true);

      const res = await fetch("/api/User/coupon/remove", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.message || "Failed to remove coupon");
        return;
      }

      showMessage("success", data.message || "Coupon removed successfully");
      await refreshCart?.();
    } catch (error) {
      showMessage("error", "Something went wrong");
    } finally {
      setLoadingCoupon(false);
    }
  };

  const isCouponApplied = !!cart?.coupon;
  const discount = cart?.discountAmount || 0;

  return (
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Tag size={18} className="text-orange-600" />
          Apply Coupon
        </h2>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm border ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {isCouponApplied ? (
          <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
            <div>
              <p className="text-sm font-semibold text-green-800">
                Coupon Applied ✅
              </p>
              <p className="text-xs text-green-700 mt-1">
                You saved{" "}
                <span className="font-semibold">
                  ₹{discount.toLocaleString()}
                </span>
              </p>
            </div>

            <button
              onClick={handleRemoveCoupon}
              disabled={loadingCoupon}
              className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {loadingCoupon ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <X size={16} />
                  Remove
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="SAVE10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                />
              </div>

              <button
                onClick={handleApplyCoupon}
                disabled={loadingCoupon}
                className="cursor-pointer mt-0 sm:mt-6 bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingCoupon ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Tag size={18} />
                    Apply
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-gray-500">
              Tip: Coupon will apply instantly and update your total amount.
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyCoupon;
