"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StoreSettingsContext = createContext();

export const useStoreSettings = () => useContext(StoreSettingsContext);

export const StoreSettingsProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchStoreSettings = async () => {
    try {
      const data = await axios.get("/api/Admin/e-commerce/general/");
      setStoreSettings(data?.data?.settings );

      
    } catch (error) {
      console.error("Failed to fetch store settings", error);
    } finally {
      setLoading(false);
    }
  };

  const saveStoreSettings = async (form) => {
    try {
      setBtnLoading(true);
      const data = await axios.put("/api/Admin/e-commerce/general/add/", form , 
          {withCredentials: true}
      );
      setStoreSettings(data?.settings);
      toast.success(data.message);
    } catch (error) {
      console.error("Error saving store settings", error);
      toast.error("Failed to update store settings.");
    } finally {
      setBtnLoading(false);
    }
  };



  return (
    <StoreSettingsContext.Provider
      value={{
        storeSettings,
        setStoreSettings,
        loading,
        btnLoading,
        fetchStoreSettings,
        saveStoreSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};
