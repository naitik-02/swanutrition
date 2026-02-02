// app/account/layout.jsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Package, Shield, User } from "lucide-react";
import { useUser } from "@/context/user";

const tabs = [
  { href: "/account/address", label: "My Addresses", icon: MapPin },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/privacy", label: "Account Privacy", icon: Shield },
];

const AccountLayout = ({ children }) => {
  const { user } = useUser();
  const pathname = usePathname();

  const normalizedPathname =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  return (
    <div className="max-w-7xl m-auto px-5 md:px-20  my-10 overflow-y-auto flex ">
      <aside className="w-50 border-r border-gray-300 hidden md:flex flex-col">
        <div className="pb-3 border-b border-gray-300 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{user?.phone}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(({ href, label, icon: Icon }) => {
            // Check if current path starts with the tab href
            const active =
              normalizedPathname === href ||
              normalizedPathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition ${
                  active
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-0 md:pl-4 lg:pl-4">
        <h1 className="text-2xl font-semibold pb-3 md:pb-4 lg:pb-4">Account</h1>
        <div className="rounded-sm">
          {React.cloneElement(children, { user })}
        </div>
      </main>
    </div>
  );
};

export default AccountLayout;
