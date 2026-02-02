"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TopCategoriesContext = createContext();
export const useTopCategoriesContext = () => useContext(TopCategoriesContext);

export const TopCategoriesProvider = ({ children }) => {
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
 
  const [topCategoriesLoading, setTopCategoriesLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem("topCategories");
    return !saved; // If no cache, show loading
  });

  const fetchTopCategories = async (force = false) => {
    if (!force && topCategories.length > 0) return;
   
    try {
      setLoading(true);
      setTopCategoriesLoading(true);
     
      const { data } = await axios.get("/api/Admin/cms/top-categories/fetch");
      const categoriesData = data?.data || [];
     
      setTopCategories(categoriesData);
      localStorage.setItem("topCategories", JSON.stringify(categoriesData));
     
    } catch (error) {
      console.error("Fetch top categories failed:", error.message);
      if (force) {
        toast.error("Failed to fetch top categories");
      }
    } finally {
      setLoading(false);
      setTopCategoriesLoading(false);
    }
  };

  const addTopCategories = async (categoryIds) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        "/api/Admin/cms/top-categories/add",
        { categoryIds },
        { withCredentials: true }
      );
     
      toast.success(data?.message || "Categories added successfully");
     
      localStorage.removeItem("topCategories");
      await fetchTopCategories(true);
     
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add categories");
    } finally {
      setBtnLoading(false);
    }
  };

  const updateTopCategories = async (categoryIds) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        "/api/Admin/cms/top-categories/update",
        { categoryIds },
        { withCredentials: true }
      );
     
      toast.success(data?.message || "Top categories updated successfully");
     
      if (data?.data?.categories) {
        setTopCategories(data.data.categories);
        localStorage.setItem("topCategories", JSON.stringify(data.data.categories));
      } else {
        // Fallback: clear cache and force refresh
        localStorage.removeItem("topCategories");
        await fetchTopCategories(true);
      }
     
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const removeTopCategory = async (categoryId) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(
        `/api/Admin/cms/top-categories/delete/${categoryId}`,
        { withCredentials: true }
      );
     
      toast.success(data?.message || "Category removed successfully");
     
      // ✅ Update local state immediately by filtering out the removed category
      const updatedCategories = topCategories.filter(cat => cat._id !== categoryId);
      setTopCategories(updatedCategories);
      localStorage.setItem("topCategories", JSON.stringify(updatedCategories));
     
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove category");
    } finally {
      setBtnLoading(false);
    }
  };

  // ✅ Clear cache function (useful for logout, etc.)
  const clearCache = () => {
    setTopCategories([]);
    localStorage.removeItem("topCategories");
    setTopCategoriesLoading(false);
  };

  const refreshTopCategories = async () => {
    localStorage.removeItem("topCategories");
    await fetchTopCategories(true);
  };

  // useEffect(() => {
  //   const saved = localStorage.getItem("topCategories");
   
  //   if (saved) {
  //     try {
  //       const parsedCategories = JSON.parse(saved);
  //       setTopCategories(parsedCategories);
  //       setTopCategoriesLoading(false); 
  //     } catch (err) {
  //       console.error("Failed to parse localStorage:", err);
  //       localStorage.removeItem("topCategories");
  //       fetchTopCategories(true);
  //     }
  //   } else {
  //     fetchTopCategories(true);
  //   }
  // }, []);

  return (
    <TopCategoriesContext.Provider
      value={{
        topCategories,
        fetchTopCategories,
        addTopCategories,
        updateTopCategories,
        removeTopCategory,
        refreshTopCategories,
        clearCache, 
        loading,
        btnLoading,
        topCategoriesLoading,
      }}
    >
      {children}
    </TopCategoriesContext.Provider>
  );
};