"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSettingsContext = createContext();

export const usePaymentSettingsContext = () => useContext(PaymentSettingsContext);

export const PaymentSettingsProvider = ({ children }) => {
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

 
  const fetchPaymentSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/Admin/e-commerce/payment/");
      if (res.data.success) {
        setPaymentSettings(res.data.settings);
      }
    } catch (error) {
     
    } finally {
      setLoading(false);
    }
  };


  const updatePaymentSettings = async (formData) => {
    setBtnLoading(true);
    try {
      const res = await axios.put("/api/Admin/e-commerce/payment/add/", formData,
        {withCredentials: true}
      );
      if (res.data.success) {
        setPaymentSettings(res.data.settings);
        toast.success("Payment settings updated successfully");
      } else {
        toast.error("Failed to update payment settings");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };



  return (
    <PaymentSettingsContext.Provider
      value={{
        paymentSettings,
        loading,
        btnLoading,
        fetchPaymentSettings,
        updatePaymentSettings,
      }}
    >
      {children}
    </PaymentSettingsContext.Provider>
  );
};
