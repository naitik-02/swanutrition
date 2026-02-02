"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EmailSettingsContext = createContext();
export const useEmailSettingsContext = () => useContext(EmailSettingsContext);

export const EmailSettingsProvider = ({ children }) => {
  const [generalSettings, setGeneralSettings] = useState(null);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [customerNotifications, setCustomerNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchEmailSettings = async () => {
    try {
      setLoading(true);

      const [notificationsRes, generalRes] = await Promise.all([
        axios.get("/api/Admin/e-commerce/emails/"),
        axios.get("/api/Admin/e-commerce/emails/setting/"),
      ]);

      setGeneralSettings(generalRes.data);
      setAdminNotifications(notificationsRes.data.adminNotifications || []);
      setCustomerNotifications(
        notificationsRes.data.customerNotifications || [],
      );

      setLoading(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchEmailSettings();
  // }, []);

  const updateGeneralSettings = async (data) => {
    try {
      setBtnLoading(true);
      const res = await axios.put(
        "/api/Admin/e-commerce/emails/setting/add/",
        data,
        { withCredentials: true },
      );
      setGeneralSettings(res.data);
      toast.success("General settings updated!");
    } catch (error) {
      toast.error("Failed to update general settings");
    } finally {
      setBtnLoading(false);
    }
  };

  const updateNotification = async (type, data) => {
    try {
      setBtnLoading(true);
      const res = await axios.put(
        `/api/Admin/e-commerce/emails/add/${type}`,
        data,
        { withCredentials: true },
      );

      if (
        ["newOrder", "canceledOrder", "failedOrder", "refundedOrder"].includes(
          type,
        )
      ) {
        setAdminNotifications((prev) =>
          prev.map((item) => (item.type === type ? res.data : item)),
        );
      } else {
        setCustomerNotifications((prev) =>
          prev.map((item) => (item.type === type ? res.data : item)),
        );
      }

      toast.success("Notification updated!");
    } catch (error) {
      toast.error("Failed to update notification");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <EmailSettingsContext.Provider
      value={{
        generalSettings,
        adminNotifications,
        customerNotifications,
        loading,
        btnLoading,
        fetchEmailSettings,
        updateGeneralSettings,
        updateNotification,
      }}
    >
      {children}
    </EmailSettingsContext.Provider>
  );
};
