"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AccountPrivacyContext = createContext();

export const useAccountPrivacyContext = () => useContext(AccountPrivacyContext);

export const AccountPrivacyProvider = ({ children }) => {
  const [accountPrivacy, setAccountPrivacy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Fetch account privacy settings
  const fetchAccountPrivacy = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/Admin/e-commerce/account-privacy/");
      setAccountPrivacy(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveAccountPrivacy = async (data) => {
    try {
      setBtnLoading(true);
      const res = await axios.patch(
        "/api/Admin/e-commerce/account-privacy/add",
        data,
        { withCredentials: true }
      );
      setAccountPrivacy(res.data);
      toast.success("Privacy settings saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save privacy settings");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <AccountPrivacyContext.Provider
      value={{
        accountPrivacy,
        loading,
        btnLoading,
        saveAccountPrivacy,
        fetchAccountPrivacy,
      }}
    >
      {children}
    </AccountPrivacyContext.Provider>
  );
};
