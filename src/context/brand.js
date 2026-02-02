"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const BrandContext = createContext();

export const useBrandContext = () => useContext(BrandContext);

export const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/User/brand/");
      setBrands(data?.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (formData) => {
    try {
        
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/brand/add", formData, {withCredentials: true});

      toast.success(data?.message);

      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || "Brand creation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const updateBrand = async (id, formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `/api/Admin/brand/update/${id}`,
        formData,
     {withCredentials: true}
      );

      toast.success(data?.message);
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || "Brand update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteBrand = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(`/api/Admin/brand/delete/${id}`, {withCredentials: true});

      toast.success(data?.message);
      fetchBrands();
    } catch (error) {
      toast.error(error.response?.data?.message || "Brand deletion failed");
    } finally {
      setBtnLoading(false);
    }
  };



  return (
    <BrandContext.Provider
      value={{
        brands,
        fetchBrands,
        createBrand,
        updateBrand,
        deleteBrand,
        btnLoading,
        loading,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};
