"use client";
import { useState } from "react";
import { Menu, X, ChevronDown, User, Settings, LogOut, Zap } from "lucide-react";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";

const Header = ({ onMenuClick, sidebarOpen }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { dashUser, logoutAdmin } = useUser();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Logo - Hidden on small mobile, visible on sm+ */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className="hidden lg:block">
              <h1 className="font-bold text-lg text-gray-800">AdminPro</h1>
              <p className="text-xs text-gray-500">Management Suite</p>
            </div>
            <div className="block lg:hidden">
              <h1 className="font-bold text-base text-gray-800">AdminPro</h1>
            </div>
          </div>
        </div>

        {/* Right section - User menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm lg:text-base">
                {dashUser?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* User info - hidden on mobile, visible on md+ */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 truncate max-w-32 lg:max-w-none">
                {dashUser?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{dashUser?.role}</p>
            </div>
            
            <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>

          {/* Dropdown menu */}
          {isUserMenuOpen && (
            <>
             
              <div
                className="fixed inset-0 z-10 md:hidden"
                onClick={() => setIsUserMenuOpen(false)}
              />
              
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20">
               
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">
                        {dashUser?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {dashUser?.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {dashUser?.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {dashUser?.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  <a
                    href="/admin/users/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Profile Settings</span>
                  </a>
                </div>

                {/* Logout section */}
                <div className="p-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logoutAdmin(router);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;