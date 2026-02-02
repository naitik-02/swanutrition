"use client";

import Header from "@/components/(admin)/Header";
import Sidebar from "@/components/(admin)/Sidebar";
import { useState } from "react";

export default function AdminShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 w-64
            transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 transition-transform duration-300 ease-in-out
            lg:flex lg:flex-shrink-0
          `}
        >
          <Sidebar onNavigate={closeSidebar} />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="max-w-7xl mx-auto">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
