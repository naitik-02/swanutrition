"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VisibilityContext = createContext();

export const useVisibilityContext = () => useContext(VisibilityContext);

export const VisibilityProvider = ({ children }) => {
  const [visibility, setVisibility] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchVisibilitySettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/Admin/e-commerce/visibility/");
      if (res.data?.success) {
        setVisibility(res.data?.settings?.mode);
        localStorage.setItem("visibility", JSON.stringify(res.data.settings));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateVisibilitySettings = async (mode) => {
    setBtnLoading(true);
    try {
      const res = await axios.put(
        "/api/Admin/e-commerce/visibility/add/",
        { mode },
        { withCredentials: true }
      );

      setVisibility(res.data?.settings);
      localStorage.removeItem("visibility");
      fetchVisibilitySettings();
      toast.success("Visibility setting updated");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem("visibility");
    if (cached) {
      setVisibility(JSON.parse(cached));
    } else {
      fetchVisibilitySettings();
    }
  }, []);

  return (
    <VisibilityContext.Provider
      value={{
        visibility,
        loading,
        btnLoading,
        fetchVisibilitySettings,
        updateVisibilitySettings,
      }}
    >
      {children}
    </VisibilityContext.Provider>
  );
};
