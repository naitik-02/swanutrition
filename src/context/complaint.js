"use client";
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const ComplaintContext = createContext();

export const useComplaintContext = () => useContext(ComplaintContext);

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [complaint, setComplaint] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitComplaint = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/User/order/complaint/add", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(data?.message);
      setBtnLoading(false);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit complaint");
      setBtnLoading(false);
      throw error;
    }
  };

  const fetchComplaintByOrderId = async (orderId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/User/order/complaint/${orderId}`, {
        withCredentials: true,
      });
      setComplaint(data?.data || null);
      setLoading(false);
      return data?.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Seller/complaint/all", {
        withCredentials: true,
      });
      setComplaints(data?.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchComplaintById = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/Seller/complaint/${id}`, {
        withCredentials: true,
      });
      setComplaint(data?.data || null);
      setLoading(false);
      return data?.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // 🧾 Seller: Reply to complaint
  const replyToComplaint = async (id, sellerReply) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `/api/Seller/complaint/reply/${id}`,
        { sellerReply },
        { withCredentials: true }
      );
      toast.success(data?.message);
      setBtnLoading(false);

      // Update local state
      if (complaint && complaint._id === id) {
        setComplaint({ ...complaint, sellerReply });
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reply");
      setBtnLoading(false);
      throw error;
    }
  };

  // 🧾 Seller: Update complaint status
  const updateComplaintStatus = async (id, status) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        `/api/Seller/complaint/update/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success(data?.message);
      setBtnLoading(false);

      // Update local state
      if (complaint && complaint._id === id) {
        setComplaint({ ...complaint, status });
      }
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      setBtnLoading(false);
      throw error;
    }
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        complaint,
        submitComplaint,
        fetchComplaints,
        fetchComplaintById,
        fetchComplaintByOrderId, 
        replyToComplaint,
        updateComplaintStatus,
        btnLoading,
        loading,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};
