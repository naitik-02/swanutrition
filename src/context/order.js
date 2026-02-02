"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useCart } from "./cart";

const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [singleOrder, setSingleOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerStats, setSellerStats] = useState(null);
  const { getCart } = useCart();

  const placeOrder = async (addressId, paymentMethod) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/User/order/add",
        { addressId, paymentMethod },
        { withCredentials: true },
      );
      setCurrentOrder(res.data.order);
      Object.keys(localStorage)
        .filter((key) => key.startsWith("user_myorders_"))
        .forEach((key) => localStorage.removeItem(key));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reorder = async (orderId) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/User/order/reorder",
        { orderId },
        { withCredentials: true },
      );
      Object.keys(localStorage)
        .filter((key) => key.startsWith("user_myorders_"))
        .forEach((key) => localStorage.removeItem(key));
      getCart();
      setMyOrders(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reorder");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/User/order/my-orders/?page=${page}`, {
        withCredentials: true,
      });

      console.log("📦 API Response for page", page, ":", res.data);
      console.log("📦 Orders count:", res.data?.orders?.length);

      // Clear previous state completely
      setMyOrders(res.data);

      localStorage.setItem(`user_myorders_${page}`, JSON.stringify(res.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SELLER ----------------
  const fetchOrdersBySeller = async ({
    startDate,
    endDate,
    status,
    page = 1,
    limit = 10,
  }) => {
    try {
      setLoading(true);
      setError(null);

      let query = new URLSearchParams({ page, limit });
      if (startDate) query.append("startDate", startDate);
      if (endDate) query.append("endDate", endDate);
      if (status) query.append("status", status);

      const res = await axios.get(
        `/api/Seller/orders/all?${query.toString()}`,
        { withCredentials: true },
      );

      setSellerOrders(res.data.orders || []);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch seller orders");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSellerOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `/api/Seller/orders/update-status/${orderId}`,
        { status },
        { withCredentials: true },
      );

      setSellerOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: status } : o,
        ),
      );

      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update seller order status",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/Seller/orders/dashboard", {
        withCredentials: true,
      });
      setSellerStats(res.data.stats || null);
      // localStorage.setItem(`seller_stats`, JSON.stringify(res.data.stats));
      return res.data.stats;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch seller stats");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ADMIN ----------------
  const fetchAllOrdersAdmin = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/Admin/order/all", {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Admin fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/User/order/${id}`, {
        withCredentials: true,
      });
      setSingleOrder(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `/api/Admin/order/update/${orderId}`,
        {  status },
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        singleOrder,
        loading,
        error,
        myOrders,
        setMyOrders,
        currentOrder,
        setSellerStats,
        sellerOrders,
        sellerStats,
        placeOrder,
        reorder,
        fetchMyOrders,
        fetchOrdersBySeller,
        updateSellerOrderStatus,
        fetchSellerStats,
        fetchAllOrdersAdmin,
        fetchOrderById,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
