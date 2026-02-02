"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const PostContext = createContext();
export const usePostContext = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedPostEdit, setSelectedPostEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/posts/all/");
      setPosts(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      setLoading(false);
    }
  };

  const createPost = async (submitData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/posts/add", submitData, {
        withCredentials: true,
      });
      toast.success("Post created successfully");
      fetchPosts();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Post creation failed");
      setBtnLoading(false);
    }
  };

  const updatePost = async (id, submitFormData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `/api/Admin/posts/update/${id}`,
        submitFormData,
        { withCredentials: true }
      );
      toast.success("Post updated successfully");
      fetchPosts();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Post update failed");
      setBtnLoading(false);
    }
  };

  const deletePost = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(`/api/Admin/posts/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Post deleted successfully");
      fetchPosts();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Post delete failed");
      setBtnLoading(false);
    }
  };

  const fetchPostById = async (id) => {
    try {
      const { data } = await axios.get(`/api/Admin/posts/${id}`);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch post");
      return null;
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        fetchPosts,
        fetchPostById,
        createPost,
        updatePost,
        deletePost,
        loading,
        btnLoading,
        selectedPostEdit,
        setSelectedPostEdit,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
