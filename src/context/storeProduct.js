"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";


const StoreProductsContext = createContext();


export const useStoreProducts = () => useContext(StoreProductsContext);


export const StoreProductsProvider = ({ children }) => {
  const [storeProducts, setStoreProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  
  const fetchStoreProducts = async () => {
    try {
      const res = await axios.get("/api/Admin/e-commerce/product/");
      setStoreProducts(res.data || {});
    } catch (error) {
      console.error("Failed to fetch product settings", error);
    } finally {
      setLoading(false);
    }
  };

  
  const saveStoreProducts = async (data) => {
    try {
      setBtnLoading(true);
      const res = await axios.post("/api/Admin/e-commerce/product/add/", data ,
        {withCredentials: true}
      );
      setStoreProducts(data);
      toast.success(res.data.message || "Product settings updated.");
    } catch (error) {
      console.error("Error saving product settings", error);
      toast.error("Failed to update product settings.");
    } finally {
      setBtnLoading(false);
    }
  };

  
  // useEffect(() => {
  //   fetchStoreProducts();
  // }, []);

  return (
    <StoreProductsContext.Provider
      value={{
        storeProducts,
        setStoreProducts,
        loading,
        btnLoading,
        fetchStoreProducts,
        saveStoreProducts,
      }}
    >
      {children}
    </StoreProductsContext.Provider>
  );
};
