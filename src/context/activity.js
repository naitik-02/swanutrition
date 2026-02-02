"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

 const fetchActivities = async ({ page = 1, limit = 10, startDate = "", endDate = "" }) => {
  try {
    setLoading(true);

    const query = new URLSearchParams({ page, limit });
    if (startDate) query.append("startDate", startDate);
    if (endDate) query.append("endDate", endDate);

    const { data } = await axios.get(`/api/Admin/activity?${query.toString()}/`, {
      withCredentials: true,
    });

    setActivities(data.activities);
    setPagination(data.pagination);
  } catch (error) {
  } finally {
    setLoading(false);
  }
};

  return (
    <ActivityContext.Provider
      value={{
        activities,
        pagination,
        loading,
        fetchActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => useContext(ActivityContext);
