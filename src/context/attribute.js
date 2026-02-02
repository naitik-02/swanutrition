"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AttributeContext = createContext();

export const useAttributeContext = () => useContext(AttributeContext);

export const AttributeProvider = ({ children }) => {
  const [attributes, setAttributes] = useState([]);
  const [attributeTerms, setAttributeTerms] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/attributes/all/");
      setAttributes(data?.attributes || []);
      console.log(data.attribute);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
      setLoading(false);
    }
  };

  const fetchAttributeTerms = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/attributeterm/all");
      setAttributeTerms(data?.terms || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attribute terms:", error.message);
      setLoading(false);
    }
  };

  const createAttribute = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/attributes/add", formData, {withCredentials: true});
      toast.success(data?.message);
      fetchAttributes();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Attribute creation failed");
      setBtnLoading(false);
    }
  };

  const updateAttribute = async (id, formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.patch(
        `/api/Admin/attributes/update/${id}`,
        formData,
      {withCredentials: true}
      );
      toast.success(data?.message);
      fetchAttributes();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Attribute update failed");
      setBtnLoading(false);
    }
  };

  const deleteAttribute = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete("/api/Admin/attributes/delete", {
        data: { id },
       withCredentials: true,
      });
      toast.success(data?.message);
      fetchAttributes();
      fetchAttributeTerms();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Attribute deletion failed");
      setBtnLoading(false);
    }
  };

  const createAttributeTerm = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        "/api/Admin/attributeterm/add",
        formData,
      {withCredentials: true}
      );
      toast.success(data?.message);
      fetchAttributeTerms();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Term creation failed");
      setBtnLoading(false);
    }
  };

  const updateAttributeTerm = async (id, formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.patch(
        `/api/Admin/attributeterm/update/${id}`,
        formData,
       {withCredentials: true}
      );
      toast.success(data?.message);
      fetchAttributeTerms();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Term update failed");
      setBtnLoading(false);
    }
  };

  const deleteAttributeTerm = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete("/api/Admin/attributeterm/delete", {
        data: { id },
       withCredentials: true,
      });
      toast.success(data?.message);
      fetchAttributeTerms();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Term deletion failed");
      setBtnLoading(false);
    }
  };

  const bulkDeleteAttributeTerms = async (termIds) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(
        "/api/Admin/attributeterm/bulkdelete",
        {
          data: { termIds },
         withCredentials: true,
        }
      );
      toast.success(data?.message);
      fetchAttributeTerms();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Bulk deletion failed");
      setBtnLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const getAttributeById = (id) => {
    return attributes.find((attr) => attr._id === id);
  };

  const getTermsByAttributeId = (attributeId) => {
    return attributeTerms.filter((term) => term.attribute._id === attributeId);
  };

  const getAttributeTypes = () => {
    return [
      { value: "color", label: "Color" },
      { value: "radio", label: "Radio" },
      { value: "image", label: "Image" },
      { value: "button", label: "Button" },
      { value: "select", label: "Select" },
    ];
  };


  return (
    <AttributeContext.Provider
      value={{
        attributes,
        attributeTerms,
        btnLoading,
        loading,

        fetchAttributes,
        createAttribute,
        updateAttribute,
        deleteAttribute,

        fetchAttributeTerms,
        createAttributeTerm,
        updateAttributeTerm,
        deleteAttributeTerm,
        bulkDeleteAttributeTerms,

        generateSlug,
        getAttributeById,
        getTermsByAttributeId,
        getAttributeTypes,
      }}
    >
      {children}
    </AttributeContext.Provider>
  );
};
