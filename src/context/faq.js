"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FaqContext = createContext();

export const useFaqContext = () => useContext(FaqContext);

export const FaqProvider = ({ children }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);


  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/Admin/cms/faq/fetch/");
      setFaqs(data?.faqs || []);
     
    } catch (error) {
      console.error("Error fetching FAQs:", error.message);
    } finally {
      setLoading(false);
    }
  };


  const createFaq = async (faqData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/cms/faq/add", faqData, {withCredentials: true});
      toast.success(data?.message);
      fetchFaqs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "FAQ creation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const updateFaq = async (id, faqData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(`/api/Admin/cms/faq/update/${id}`, faqData, {withCredentials: true});
      toast.success(data?.message);
      fetchFaqs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "FAQ update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  
  const deleteFaq = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(`/api/Admin/cms/faq/delete/${id}`, {withCredentials: true});
      toast.success(data?.message);
      fetchFaqs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "FAQ deletion failed");
    } finally {
      setBtnLoading(false);
    }
  };

 

  return (
    <FaqContext.Provider
      value={{
        faqs,
        fetchFaqs,
        createFaq,
        updateFaq,
        deleteFaq,
        loading,
        btnLoading,
      }}
    >
      {children}
    </FaqContext.Provider>
  );
};
