"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "@/components/loading";

const generalContext = createContext();

export const useGeneral = () => useContext(generalContext);

export const GeneralContextProvider = ({ children }) => {
  const [topHeaderData, setTopHeaderData] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [headerLoading, setHeaderLoading] = useState(false);

  const fetchHeaderData = async () => {
    try {
      setHeaderLoading(true);
      console.log("Fetching header data...");
      
      const res = await axios.get("/api/User/header");
      const data = res.data;
      
      if (data.data) {
        setHeaderData(data.data);  
        setTopHeaderData(data.data); 
        console.log("Header data loaded:", data.data);
      }
    } catch (error) {
      console.error("Error fetching header:", error);
      toast.error("Failed to load header data");
    } finally {
      setHeaderLoading(false);
    }
  };

  useEffect(() => {
    fetchHeaderData();
  }, []);
  return (
    <generalContext.Provider
      value={{
        fetchHeaderData,
        headerLoading,
        setHeaderLoading,
        headerData,
        setHeaderData,
        topHeaderData,
        setTopHeaderData,
      }}
    >
      {headerLoading ? <Loading /> : children}
    </generalContext.Provider>
  );
};