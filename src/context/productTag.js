"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TagContext = createContext();

export const useTagContext = () => useContext(TagContext);

export const TagProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // ✅ Fetch Tags
  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/tags/fetch/", { withCredentials: true });
      setTags(data?.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create Tag
  const createTag = async (payload) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/tags/add/", payload, { withCredentials: true });
      toast.success(data?.message);
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Tag creation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  // ✅ Update Tag
  const updateTag = async (id, payload) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(`/api/Admin/tags/update/${id}`, payload, { withCredentials: true });
      toast.success(data?.message);
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Tag update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  // ✅ Delete Tag
  const deleteTag = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(`/api/Admin/tags/delete/${id}`, { withCredentials: true });
      toast.success(data?.message);
      fetchTags();
    } catch (error) {
      toast.error(error.response?.data?.message || "Tag deletion failed");
    } finally {
      setBtnLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchTags();
  // }, []);

  return (
    <TagContext.Provider
      value={{
        tags,
        fetchTags,
        createTag,
        updateTag,
        deleteTag,
        loading,
        btnLoading,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};
