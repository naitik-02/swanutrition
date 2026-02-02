"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const CategoryContext = createContext();

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categoryLoading, setCategoryLoading] = useState(false);

  const fetchCategories = async (search = "") => {
    try {
      setLoading(true);
      setCategoryLoading(true);

      const { data } = await axios.get(`/api/User/category/`, {
        params: { q: search },
      });

      setCategories(data?.categories || []);
      localStorage.setItem("categories", JSON.stringify(data?.categories));

      setCategoryLoading(false);
    } catch (error) {
    } finally {
      setLoading(false);
      setCategoryLoading();
    }
  };

  const createCategory = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/category/add", formData, {
        withCredentials: true,
      });

      toast.success(data?.message);
      localStorage.removeItem("categories");
      fetchCategories();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Category creation failed");
      setBtnLoading(false);
    }
  };

  const DeleteCategory = async (id) => {
    try {
      setBtnLoading(false);
      const { data } = await axios.delete(
        "/api/Admin/category/delete",

        {
          data: { id },
          withCredentials: true,
        }
      );

      toast.success(data?.message);
      localStorage.removeItem("categories");

      fetchCategories();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "failed");
      setBtnLoading(false);
    }
  };

  const UpdateCategory = async (id, formData) => {
    try {
      console.log(formData);
      setBtnLoading(true);
      const { data } = await axios.patch(
        `/api/Admin/category/update/${id}`,
        formData,
        { withCredentials: true }
      );

      toast.success(data?.message);
      localStorage.removeItem("categories");

      fetchCategories();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "failed");
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem("categories");
    if (cached) {
      setCategories(JSON.parse(cached));
    } else {
      fetchCategories();
    }
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        fetchCategories,
        createCategory,
        DeleteCategory,
        UpdateCategory,
        btnLoading,
        loading,
        categoryLoading,
      }}
    >
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </CategoryContext.Provider>
  );
};
