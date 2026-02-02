"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const HeroSliderContext = createContext();
export const useHeroSliderContext = () => useContext(HeroSliderContext);

export const HeroSliderProvider = ({ children }) => {
  const [heroSliders, setHeroSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // ✅ Initialize heroLoading based on localStorage availability
  const [heroLoading, setHeroLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    const savedSetting = localStorage.getItem("herosetting");
    return !savedSetting; // If no cache, show loading
  });

  const fetchHeroSliders = async () => {
    try {
      setLoading(true);
      setHeroLoading(true);
      localStorage.removeItem("herosetting");
      const { data } = await axios.get("/api/Admin/cms/herosection/fetch/");
      setHeroSliders(data?.data || []);
      localStorage.setItem("herosetting", JSON.stringify(data?.data));
    } catch (error) {
      console.error("Error fetching hero sliders:", error);
    } finally {
      setLoading(false);
      setHeroLoading(false);
    }
  };

  const createHeroSlider = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        "/api/Admin/cms/herosection/add",
        formData,
        { withCredentials: true }
      );
      toast.success(data?.message);
      localStorage.removeItem("herosetting");
      fetchHeroSliders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Slider creation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const updateHeroSlider = async (id, formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `/api/Admin/cms/herosection/update/${id}`,
        formData,
        { withCredentials: true }
      );
      toast.success(data?.message);
      localStorage.removeItem("herosetting");
      fetchHeroSliders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Slider update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHeroSlider = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(
        `/api/Admin/cms/herosection/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(data?.message);
      localStorage.removeItem("herosetting");
      fetchHeroSliders();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Slider deletion failed");
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    const savedSetting = localStorage.getItem("herosetting");

    if (savedSetting) {
      try {
        const parsed = JSON.parse(savedSetting);
        setHeroSliders(parsed);
        setHeroLoading(false);
      } catch (err) {
        setHeroSliders([]);
        localStorage.removeItem("herosetting");
        fetchHeroSliders();
      }
    } else {
      fetchHeroSliders();
    }
  }, []);

  return (
    <HeroSliderContext.Provider
      value={{
        heroSliders,
        fetchHeroSliders,
        createHeroSlider,
        updateHeroSlider,
        deleteHeroSlider,
        loading,
        btnLoading,
        heroLoading,
      }}
    >
      {children}
    </HeroSliderContext.Provider>
  );
};
