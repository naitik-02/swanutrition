"use client";
import React from "react";
import Link from "next/link";
import {
  MapPin,
  ShoppingBag,
  Gift,
  HelpCircle,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: MapPin, label: "My Addresses", href: "/account/address" },
  { icon: ShoppingBag, label: "My Orders", href: "/account/orders" },
  { icon: ShieldCheck, label: "Account Privacy", href: "/account/privacy" },
];

const logoutItem = {
  icon: LogOut,
  label: "Sign Out",
  href: "#",
  className: "text-red-600",
};

const Menudropdown = ({ setIsAccountDropdownOpen, user, logoutUser }) => {
  const LogoutHandler = () => {
    logoutUser();
    setIsAccountDropdownOpen(false);
  };
  return (
    <div className="absolute right-0 top-[100%] mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{user?.phone}</p>
      </div>

      <div className="py-2">
        {menuItems.map((item, index) => (
          <Link
            href={item.href}
            key={index}
            onClick={() => setIsAccountDropdownOpen(false)}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-600 hover:text-white transition duration-150 ease-in-out"
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-2">
        <Link
          href={logoutItem.href}
          onClick={() => LogoutHandler()}
          className={`flex items-center px-4 py-2 text-sm hover:bg-orange-600 hover:text-white transition duration-150 ease-in-out ${logoutItem.className}`}
        >
          <logoutItem.icon className="h-4 w-4 mr-3" />
          {logoutItem.label}
        </Link>
      </div>
    </div>
  );
};

export default Menudropdown;
