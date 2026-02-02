"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronDown, X } from "lucide-react";
import { menuItems } from "./MenuLists";
import { useUser } from "@/context/user";

const Sidebar = ({ onNavigate }) => {
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = useState("ecommerce");
  const { dashUser } = useUser();

  const userPermissions = dashUser?.permissions || [];

  const normalize = (path) => path.replace(/\/$/, "");
  const isActive = (href) => normalize(pathname) === normalize(href);
  const hasPermission = (required) => {
    if (dashUser?.role === "admin") return true;
    if (!required) return true;
    return userPermissions.includes(required);
  };

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col shadow-lg lg:shadow-sm">
      <div className="p-4 lg:p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800">Admin Panel</h2>
        <button
          onClick={onNavigate}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
        <ul className="space-y-1 lg:space-y-2">
          {menuItems
            .filter((item) => hasPermission(item.permission))
            .map((item) => {
              const Icon = item.icon;
              const isOpen = openSubMenu === item.id;

              if (item.subItems) {
                const visibleSubItems = item.subItems.filter((sub) =>
                  hasPermission(sub.permission)
                );
                if (visibleSubItems.length === 0) return null;

                const isAnySubItemActive = visibleSubItems.some((sub) =>
                  isActive(sub.href)
                );

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setOpenSubMenu(isOpen ? null : item.id)}
                      className={`w-full flex items-center justify-between px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-left transition-all duration-200 group ${
                        isAnySubItemActive || isOpen
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${
                            isAnySubItemActive || isOpen
                              ? "text-blue-600"
                              : "text-gray-500 group-hover:text-gray-700"
                          }`}
                        />
                        <span className="font-medium text-sm truncate">
                          {item.label}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      )}
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="mt-1 lg:mt-2 ml-3 lg:ml-4 space-y-1 border-l-2 border-gray-100 pl-3 lg:pl-4">
                        {visibleSubItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const active = isActive(sub.href);
                          return (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={handleLinkClick}
                                className={`flex items-center space-x-2 lg:space-x-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-md text-sm transition-all duration-200 group ${
                                  active
                                    ? "bg-blue-100 text-blue-700 border-l-2 border-blue-500 font-medium"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                              >
                                <SubIcon
                                  className={`w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0 ${
                                    active
                                      ? "text-blue-600"
                                      : "text-gray-400 group-hover:text-gray-600"
                                  }`}
                                />
                                <span className="truncate">{sub.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              }

              const active = isActive(item.href);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-sm transition-all duration-200 group ${
                      active
                        ? "bg-blue-50 text-blue-600 border border-blue-200 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${
                        active
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Admin Panel
        </div>
      </div>
    </div>
  );
};

export default Sidebar;