"use client";

import React, { useState } from "react";
import {
  Minus,
  Plus,
  CreditCard,
  Smartphone,
  Truck,
  Trash2,
  Tag,
} from "lucide-react";

const Payment = ({ paymentSettings, setPaymentMethod, paymentMethod }) => {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      {paymentSettings?.check?.enabled && (
        <label className="relative flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 mr-4 flex items-center justify-center ${
              paymentMethod === "upi"
                ? "border-orange-500 bg-orange-500"
                : "border-gray-300"
            }`}
          >
            {paymentMethod === "upi" && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <Smartphone className="text-orange-500 mr-3" size={20} />
          <div>
            <span className="font-medium text-gray-900">UPI Payment</span>
            <p className="text-sm text-gray-500">
              Pay with PhonePe, GPay, Paytm & more
            </p>
          </div>
        </label>
      )}
      {paymentSettings?.bankTransfer?.enabled && (
        <label className="relative flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 mr-4 flex items-center justify-center ${
              paymentMethod === "card"
                ? "border-green-500 bg-green-500"
                : "border-gray-300"
            }`}
          >
            {paymentMethod === "card" && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <CreditCard className="text-green-500 mr-3" size={20} />
          <div>
            <span className="font-medium text-gray-900">Credit/Debit Card</span>
            <p className="text-sm text-gray-500">
              Visa, Mastercard, RuPay accepted
            </p>
          </div>
        </label>
      )}
      {paymentSettings?.cod?.enabled && (
        <label className="relative flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 mr-4 flex items-center justify-center ${
              paymentMethod === "COD"
                ? "border-orange-500 bg-orange-500"
                : "border-gray-300"
            }`}
          >
            {paymentMethod === "COD" && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <Truck className="text-orange-500 mr-3" size={20} />
          <div>
            <span className="font-medium text-gray-900">Cash on Delivery</span>
            <p className="text-sm text-gray-500">Pay when your order arrives</p>
          </div>
        </label>
      )}
    </div>
  );
};

export default Payment;
