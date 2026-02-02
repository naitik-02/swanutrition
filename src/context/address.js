"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddressContext = createContext();

export const useAddressContext = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/User/address/my-address/", {
        withCredentials: true,
      });
      const data = res.data.addresses || [];
      setAddresses(data);

      localStorage.setItem("user_myAddresses", JSON.stringify(data));
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/User/address/add", data, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("user_myAddresses");
      await fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id, formData) => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/User/address/update/${id}`, formData, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("user_myAddresses");

      await fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `/api/User/address/updateDefault/${id}`,
        null,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      localStorage.removeItem("myAddresses");

      await fetchAddresses();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to set default address"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/User/address/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("user_myAddresses");

      await fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddressContext.Provider
      value={{
        setDefaultAddress,
        setAddresses,
        addresses,
        loading,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
