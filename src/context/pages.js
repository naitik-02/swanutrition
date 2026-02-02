"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PageContext = createContext();
export const usePageContext = () => useContext(PageContext);

export const PageProvider = ({ children }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // 🔹 Fetch All Pages
  const fetchPages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/pages/all/");
      setPages(data?.data || []);
    } catch (error) {
      console.error("Error fetching pages:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Single Page
  const fetchSinglePage = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/Admin/page/${id}/`, {
        withCredentials: true,
      });
      return data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch page");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/pages/add", formData, {
        withCredentials: true,
      });
      toast.success(data?.message);
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Page creation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const updatePage = async (id, formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `/api/Admin/pages/update/${id}`,
        formData,
        { withCredentials: true }
      );
      toast.success(data?.message);
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Page update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  // 🔹 Delete Page
  const deletePage = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(`/api/Admin/pages/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(data?.message);
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Page deletion failed");
    } finally {
      setBtnLoading(false);
    }
  };

 
  const updatePageStatus = async (id, status) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.patch(
        `/api/Admin/pages/update-status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success(data?.message);
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  // 🔹 Add Section
  const addSection = async (pageId, sectionData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        `/api/Admin/pages/section/add/${pageId}`,
        sectionData,
        { withCredentials: true }
      );
      toast.success(data?.message);
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add section");
    } finally {
      setBtnLoading(false);
    }
  };

 
const updateSection = async (sectionData) => {
  try {
    setBtnLoading(true);
    console.log( "section data", sectionData)

    const { data } = await axios.put(
      `/api/Admin/pages/section/update`,
      sectionData, 
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      }
    );

    toast.success(data?.message);
    fetchPages();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update section");
  } finally {
    setBtnLoading(false);
  }
};

  // 🔹 Delete Section
 const deleteSection = async (pageId, sectionId) => {
  try {
    setBtnLoading(true);
    const { data } = await axios.delete(
      `/api/Admin/pages/section/delete/`,
      {
        data: { pageId, sectionId }, // ✅ body yahan
        withCredentials: true,       // ✅ config bhi yahi
      }
    );
    toast.success(data?.message);
    fetchPages();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete section");
  } finally {
    setBtnLoading(false);
  }
};


  // 🔹 Reorder Sections
  const reorderSections = async (pageId, newOrder) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.patch(
        `/api/Admin/pages/section/reorder/${pageId}`,
        { sections: newOrder },
        { withCredentials: true }
      );
      toast.success(data?.message);
      fetchPages();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reorder sections"
      );
    } finally {
      setBtnLoading(false);
    }
  };

 

  return (
    <PageContext.Provider
      value={{
        pages,
        fetchPages,
        fetchSinglePage,
        createPage,
        updatePage,
        deletePage,
        updatePageStatus,
        addSection,
        updateSection,
        deleteSection,
        reorderSections,
        btnLoading,
        loading,
        setLoading,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};
