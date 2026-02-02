"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "./user";

const PostTagContext = createContext();

export const usePostTagContext = () => useContext(PostTagContext);

export const PostTagProvider = ({ children }) => {
  const [postTags, setPostTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const {isDashAuth} = useUser()

  // ✅ Fetch all post tags
  const fetchPostTags = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/posts/tags/");
      setPostTags(data?.tags || []);
    } catch (error) {
      console.error("Error fetching post tags:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create a new tag
  const createPostTag = async (tagData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/posts/tags/add", tagData,{withCredentials: true});
      toast.success("Post tag created");
      fetchPostTags();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to create tag");
    } finally {
      setBtnLoading(false);
    }
  };

  // ✅ Update tag by ID
  const updatePostTag = async (id, tagData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(`/api/Admin/posts/tags/update/${id}`, tagData, {withCredentials: true});
      toast.success("Post tag updated");
      fetchPostTags();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update tag");
    } finally {
      setBtnLoading(false);
    }
  };

  // ✅ Delete tag by ID
  const deletePostTag = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(`/api/Admin/posts/tags/delete/${id}`, {withCredentials: true});
      toast.success("Post tag deleted");
      fetchPostTags();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to delete tag");
    } finally {
      setBtnLoading(false);
    }
  };

  
  // useEffect(() => {
  //  if(isDashAuth){
  //    fetchPostTags();
  //  }
  // }, []);

  return (
    <PostTagContext.Provider
      value={{
        postTags,
        fetchPostTags,
        createPostTag,
        updatePostTag,
        deletePostTag,
        loading,
        btnLoading,
      }}
    >
      {children}
    </PostTagContext.Provider>
  );
};
