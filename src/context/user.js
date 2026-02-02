"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dashUser, setDashUser] = useState(null);
  const [isDashAuth, setIsDashAuth] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const [userLoading, setUserLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);

  const fetchingUser = useRef(false);
  const fetchingAdmin = useRef(false);

  const isCacheValid = (timestamp) => {
    return Date.now() - timestamp < 60 * 60 * 1000;
  };

  const getCachedUserData = () => {
    try {
      const userCache = localStorage.getItem("userAuth");
      if (userCache) {
        const parsed = JSON.parse(userCache);
        if (isCacheValid(parsed.timestamp)) {
          return {
            user: parsed.user,
            isAuth: true,
          };
        } else {
          localStorage.removeItem("userAuth");
          return null;
        }
      }
    } catch (error) {
      console.warn("Failed to retrieve cached user data:", error);
      localStorage.removeItem("userAuth");
    }
    return null;
  };

  const getCachedAdminData = () => {
    try {
      const adminCache = localStorage.getItem("adminAuth");
      if (adminCache) {
        const parsed = JSON.parse(adminCache);
        if (isCacheValid(parsed.timestamp)) {
          return {
            user: parsed.user,
            isAuth: true,
          };
        } else {
          localStorage.removeItem("adminAuth");
          return null;
        }
      }
    } catch (error) {
      console.warn("Failed to retrieve cached admin data:", error);
      localStorage.removeItem("adminAuth");
    }
    return null;
  };

  const fetchUser = async (force = false) => {
    if (!force && fetchingUser.current) return;
    if (!force && isAuth && user) return;

    try {
      fetchingUser.current = true;
      setUserLoading(true);

      // Use cache first (seller pattern)
      if (!force) {
        const cached = getCachedUserData();
        if (cached) {
          setUser(cached.user);
          setIsAuth(cached.isAuth);
          setUserLoading(false);
          fetchingUser.current = false;
          return;
        }
      }

      const { data } = await axios.get("/api/User/auth/fetch/", {
        withCredentials: true,
      });

      if (data?.user) {
        setUser(data.user);
        setIsAuth(true);
        localStorage.setItem(
          "userAuth",
          JSON.stringify({
            user: data.user,
            timestamp: Date.now(),
          }),
        );
      } else {
        setUser(null);
        setIsAuth(false);
        localStorage.removeItem("userAuth");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);

      // Fallback to cache on error (seller pattern)
      const cached = getCachedUserData();
      if (cached) {
        setUser(cached.user);
        setIsAuth(cached.isAuth);
        toast.info("Using cached data. Please check your connection.");
      } else {
        setUser(null);
        setIsAuth(false);
        localStorage.removeItem("userAuth");
      }
    } finally {
      setUserLoading(false);
      fetchingUser.current = false;
    }
  };

  const fetchDashUser = async (force = false) => {
    if (!force && fetchingAdmin.current) return;
    if (!force && isDashAuth && dashUser) return;

    try {
      fetchingAdmin.current = true;
      setAdminLoading(true);

      // Use cache first (seller pattern)
      if (!force) {
        const cached = getCachedAdminData();
        if (cached) {
          setDashUser(cached.user);
          setIsDashAuth(cached.isAuth);
          setAdminLoading(false);
          fetchingAdmin.current = false;
          return;
        }
      }

      const { data } = await axios.get("/api/Admin/user/fetch/", {
        withCredentials: true,
      });

      if (data?.user) {
        setDashUser(data.user);
        setIsDashAuth(true);
        localStorage.setItem(
          "adminAuth",
          JSON.stringify({
            user: data.user,
            timestamp: Date.now(),
          }),
        );
      } else {
        setDashUser(null);
        setIsDashAuth(false);
        localStorage.removeItem("adminAuth");
      }
    } catch (error) {
      console.error("Failed to fetch admin:", error);

      // Fallback to cache on error (seller pattern)
      const cached = getCachedAdminData();
      if (cached) {
        setDashUser(cached.user);
        setIsDashAuth(cached.isAuth);
        console.info("Using cached admin data");
      } else {
        setIsDashAuth(false);
        setDashUser(null);
        localStorage.removeItem("adminAuth");
      }
    } finally {
      setAdminLoading(false);
      fetchingAdmin.current = false;
    }
  };

  const requestOtp = async (phone) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        "/api/User/auth/request-otp/",
        { phone },
        { withCredentials: true },
      );
      toast.success(data.message || "OTP sent successfully");
      setOtpSent(true);
      return data?.otp;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
      setOtpSent(false);
    } finally {
      setBtnLoading(false);
    }
  };

  const verifyOtp = async (phone, otp, router) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post(
        "/api/User/auth/verify-otp/",
        { phone, otp },
        { withCredentials: true },
      );

      setUser(data.user);
      setIsAuth(true);
      localStorage.setItem(
        "userAuth",
        JSON.stringify({
          user: data.user,
          timestamp: Date.now(),
        }),
      );

      toast.success("Logged in successfully");

      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.error || "OTP verification failed");
      return { success: false };
    } finally {
      setBtnLoading(false);
    }
  };

  const logoutUser = async (router) => {
    try {
      await axios.post("/api/User/auth/logout/", {}, { withCredentials: true });
      setUser(null);
      setIsAuth(false);
      localStorage.removeItem("userAuth");
      Object.keys(localStorage)
        .filter((key) => key.startsWith("user_"))
        .forEach((key) => localStorage.removeItem(key));
      toast.success("Logged out successfully");
      if (router) router.push("/login");
    } catch (error) {
      toast.error("Failed to logout user");
    }
  };

  const dashboardLogin = async (email, password, selectedRole, router) => {
  try {
    setBtnLoading(true);

    const { data } = await axios.post(
      "/api/Admin/user/login/",
      { email, password, selectedRole },
      { withCredentials: true }
    );

    Cookies.set("adminTokenClient", data.token, {
      expires: 7,
      secure: true,
      sameSite: "lax",
    });

    setDashUser(data.user);
    setIsDashAuth(true);

    localStorage.setItem(
      "adminAuth",
      JSON.stringify({
        user: data.user,
        timestamp: Date.now(),
      })
    );

    toast.success("Admin logged in successfully");

    router.push("/admin");

    return { success: true };

  } catch (error) {
    toast.error(error.response?.data?.error || "Admin login failed");
    return { success: false };
  } finally {
    setBtnLoading(false);
  }
};

  const logoutAdmin = async (router) => {
    try {
      await axios.post(
        "/api/Admin/user/logout/",
        {},
        { withCredentials: true },
      );
      setDashUser(null);
      setIsDashAuth(false);
      localStorage.removeItem("adminAuth");
      toast.success("Admin logged out successfully");
      if (router) router.push("/auth/dashboard-login");
    } catch (error) {
      setDashUser(null);
      setIsDashAuth(false);
      localStorage.removeItem("adminAuth");
      toast.error("Logout completed locally");
      if (router) router.push("/auth/dashboard-login");
    }
  };

  const adminCreateUser = async (userData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/user/add-new/", userData, {
        withCredentials: true,
      });
      toast.success(data.message || "User created successfully");
      fetchAllUsers();
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
      return { success: false };
    } finally {
      setBtnLoading(false);
    }
  };

  const fetchAllUsers = async ({
    search = "",
    role = "",
    page = 1,
    limit = 10,
  } = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (role) params.append("role", role);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const { data } = await axios.get(
        `/api/Admin/user/all?${params.toString()}`,
        { withCredentials: true },
      );
      setAllUsers(data.users);
    } catch (error) {
      console.log(error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, updatedData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.put(
        "/api/Admin/user/update",
        { userId, data: updatedData },
        { withCredentials: true },
      );
      toast.success(data.message || "User updated successfully");
      return { success: true, user: data.user };
    } catch (error) {
      toast.error(error.response?.data?.message || "User update failed");
      return { success: false };
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete("/api/Admin/user/delete/", {
        withCredentials: true,
        data: { userId },
      });
      toast.success(data.message || "User deleted successfully");
      fetchAllUsers();
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      return { success: false };
    } finally {
      setBtnLoading(false);
    }
  };

  // Enhanced initialization (seller pattern se)
  useEffect(() => {
    const initializeAuth = async () => {
      // User cache handling
      const userCached = getCachedUserData();
      if (userCached) {
        setUser(userCached.user);
        setIsAuth(userCached.isAuth);
        setUserLoading(false);
      } else {
        await fetchUser();
      }

      // Admin cache handling
      const adminCached = getCachedAdminData();
      if (adminCached) {
        setDashUser(adminCached.user);
        setIsDashAuth(adminCached.isAuth);
        setAdminLoading(false);
      } else {
        await fetchDashUser();
      }
    };

    initializeAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        otpSent,
        requestOtp,
        verifyOtp,
        logoutUser,
        fetchUser,
        setOtpSent,
        userLoading,
        dashUser,
        adminLoading,
        isDashAuth,
        dashboardLogin,
        logoutAdmin,
        fetchDashUser,
        setDashUser,
        setIsDashAuth,

        loading,
        btnLoading,
        allUsers,
        fetchAllUsers,
        updateUser,
        deleteUser,
        adminCreateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
