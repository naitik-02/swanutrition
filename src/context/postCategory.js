"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PostCategoryContext = createContext();

export const usePostCategoryContext = () => useContext(PostCategoryContext);

export const PostCategoryProvider = ({ children }) => {
  const [postCategories, setPostCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchPostCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/posts/categories/all/");
      setPostCategories(data?.data || []);
    } catch (error) {
      console.error("Error fetching post categories:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPostCategory = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/posts/categories/add", formData, {withCredentials: true});
      toast.success(data?.message);
      fetchPostCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Post category creation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const updatePostCategory = async (id, formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(`/api/Admin/posts/categories/update/${id}`, formData, {withCredentials: true});
      toast.success(data?.message);
      fetchPostCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Post category update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const deletePostCategory = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(`/api/Admin/posts/categories/delete/${id}`,{withCredentials: true});
      toast.success(data?.message);
      fetchPostCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Post category deletion failed");
    } finally {
      setBtnLoading(false);
    }
  };


  return (
    <PostCategoryContext.Provider
      value={{
        postCategories,
        fetchPostCategories,
        createPostCategory,
        updatePostCategory,
        deletePostCategory,
        btnLoading,
        loading,
      }}
    >
      {children}
    </PostCategoryContext.Provider>
  );
};
