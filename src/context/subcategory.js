"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubcategoryContext = createContext();

export const useSubcategoryContext = () => useContext(SubcategoryContext);

export const SubcategoryProvider = ({ children }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSubcategories = async () => {
    if (subcategories.length) return;
    setLoading(true);
    const { data } = await axios.get("/api/User/subcategory/");

    setSubcategories(data.subcategories || []);
    localStorage.setItem("subcategories", JSON.stringify(data.subcategories));
    setLoading(false);
  };

  const createSubcategory = async (subcategoryData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        "/api/Admin/subcategory/add/",
        subcategoryData,
        { withCredentials: true }
      );
      toast.success(data?.message);
      localStorage.removeItem("subcategories");
      fetchSubcategories();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Subcategory creation failed");
      setBtnLoading(false);
    }
  };

  const deleteSubcategory = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(`/api/Admin/subcategory/delete/`, {
        data: { id },
        withCredentials: true,
      });
      toast.success(data?.message);
      localStorage.removeItem("subcategories");
      fetchSubcategories();

      setBtnLoading(false);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to delete subcategory"
      );
      setBtnLoading(false);
    }
  };

  const UpdateSubcategory = async (id, formData) => {
    try {
      console.log(formData);
      setBtnLoading(true);

      const { data } = await axios.patch(
        `/api/Admin/subcategory/update/${id}`,
        formData,
        { withCredentials: true }
      );

      toast.success(data?.message || "Subcategory updated successfully");
      localStorage.removeItem("subcategories");

      fetchSubcategories();
      setBtnLoading(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update subcategory"
      );
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem("subcategories");
    if (cached) {
      setSubcategories(JSON.parse(cached));
    } else {
      fetchSubcategories();
    }
  }, []);

  return (
    <SubcategoryContext.Provider
      value={{
        subcategories,
        fetchSubcategories,
        createSubcategory,
        deleteSubcategory,
        UpdateSubcategory,
        btnLoading,
        loading,
      }}
    >
      {children}
    </SubcategoryContext.Provider>
  );
};
