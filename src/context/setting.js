"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SettingContext = createContext();

export const useSettingContext = () => useContext(SettingContext);

export const SettingProvider = ({ children }) => {
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // ✅ FIXED: Always start with true, handle localStorage after mounting
  const [settingLoading, setSettingLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const fetchSetting = async (force = false) => {
    try {
      setLoading(true);
      setSettingLoading(true);

      const { data } = await axios.get("/api/Admin/cms/setting/fetch/");
      const settingData = data?.data || {};

      setSetting(settingData);

      localStorage.setItem("appSetting", JSON.stringify(settingData));
    } catch (error) {
      console.error("Fetch setting failed:", error.message);
      if (force) {
        toast.error("Failed to fetch settings");
      }
    } finally {
      setLoading(false);
      setSettingLoading(false);
    }
  };

  const createSetting = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        "/api/Admin/cms/setting/add/",
        formData,
        { withCredentials: true }
      );

      localStorage.removeItem("appSetting");

      toast.success(data?.message || "Setting created successfully");
      fetchSetting();
    } catch (error) {
      toast.error(error.response?.data?.message || "Creation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const updateSetting = async (id, formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `/api/Admin/cms/setting/update/${id}`,
        formData,
        { withCredentials: true }
      );

      localStorage.removeItem("appSetting");
      toast.success(data?.message || "Setting updated successfully");
      fetchSetting();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const clearCache = () => {
    setSetting(null);
    if (isMounted) {
      localStorage.removeItem("appSetting");
    }
    setSettingLoading(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("appSetting");

    if (saved) {
      const parsedSetting = JSON.parse(saved);
      setSetting(parsedSetting);
      setSettingLoading(false);
    } else {
      fetchSetting(true);
    }
  }, []);

  return (
    <SettingContext.Provider
      value={{
        setting,
        fetchSetting,
        createSetting,
        updateSetting,
        clearCache,
        loading,
        btnLoading,
        settingLoading,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};
