"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MediaSettingsContext = createContext();

export const useMediaSettings = () => useContext(MediaSettingsContext);

export const MediaSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/media-setting/");
      setSettings(data?.data || null);
    } catch (error) {
      console.error("Error fetching media settings:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put("/api/Admin/media-setting/update", newSettings, {withCredentials: true});
      toast.success(data?.message || "Settings saved successfully");
      setSettings(data?.data); 
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save settings");
    } finally {
      setBtnLoading(false);
    }
  };

 

  return (
    <MediaSettingsContext.Provider
      value={{
        settings,
        fetchSettings,
        saveSettings,
        loading,
        btnLoading,
      }}
    >
      {children}
    </MediaSettingsContext.Provider>
  );
};
