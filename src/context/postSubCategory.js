"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PostSubCategoryContext = createContext();

export const usePostSubCategoryContext = () =>
  useContext(PostSubCategoryContext);

export const PostSubCategoryProvider = ({ children }) => {
  const [postSubcategories, setPostSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchPostSubCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/posts/subcategory/all/");
      setPostSubCategories(data?.data || []);
    } catch (error) {
      console.error("Error fetching post subcategories:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPostSubCategory = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        "/api/Admin/posts/subcategory/add",
        formData,
       {withCredentials: true}
      );
      toast.success(data?.message);
      fetchPostSubCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Post subcategory creation failed"
      );
    } finally {
      setBtnLoading(false);
    }
  };

  const updatePostSubCategory = async (id, formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `/api/Admin/posts/subcategory/update/${id}`,
        formData,
        {withCredentials: true}
      );
      toast.success(data?.message);
      fetchPostSubCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Post subcategory update failed"
      );
    } finally {
      setBtnLoading(false);
    }
  };

  const deletePostSubCategory = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(
        `/api/Admin/posts/subcategory/delete/${id}`,
        {withCredentials: true}
      );
      toast.success(data?.message);
      fetchPostSubCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Post subcategory deletion failed"
      );
    } finally {
      setBtnLoading(false);
    }
  };

  

  return (
    <PostSubCategoryContext.Provider
      value={{
        postSubcategories,
        fetchPostSubCategories,
        createPostSubCategory,
        updatePostSubCategory,
        deletePostSubCategory,
        btnLoading,
        loading,
      }}
    >
      {children}
    </PostSubCategoryContext.Provider>
  );
};
