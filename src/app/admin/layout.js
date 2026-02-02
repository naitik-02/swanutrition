"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import AdminShell from "@/components/Layout/AdminShell.jsx";
import "react-quill-new/dist/quill.snow.css";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("adminTokenClient"); 
    // 👆 wahi naam jo login pe set kiya tha

    if (!token) {
      router.push("/auth/dashboard-login");
    }
  }, []);

  return <AdminShell>{children}</AdminShell>;
}
