"use client";

import AdminShell from "@/components/Layout/AdminShell.jsx";
import "react-quill-new/dist/quill.snow.css";

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}