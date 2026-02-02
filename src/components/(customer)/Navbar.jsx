"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, User, ShoppingCart, X, Menu, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGeneral } from "@/context/generalContext";
import { useUser } from "@/context/user";
import { useCart } from "@/context/cart";
import { useUI } from "@/context/uiContext";
import Menudropdown from "../(user)/Menudropdown";

const Navbar = ({ onCartClick }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const { loginOpen, setLoginOpen } = useUI();

  const { headerData } = useGeneral();

  const { user, isAuth, loading, logoutUser } = useUser();
  const router = useRouter();
  const { cart } = useCart();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const sortedMenus =
    headerData?.menus
      ?.filter((menu) => menu.isActive)
      ?.sort((a, b) => (a.order || 0) - (b.order || 0)) || [];

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex items-center justify-between py-4">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => handleNavigation("/")}
                className="relative h-12 w-32"
              >
                {headerData?.logo ? (
                  <Image
                    src={headerData.logo}
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <Image
                    src="/images/logo3.png"
                    alt="FreshMart Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                )}
              </button>
            </div>

            <div
              className="hidden lg:flex items-center space-x-1"
              ref={dropdownRef}
            >
              {sortedMenus.map((item, index) => (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => {
                    if (item.sub && item.sub.length > 0) {
                      setActiveDropdown(index);
                    }
                  }}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => handleNavigation(item.slug || "/")}
                    className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium text-sm relative flex items-center gap-1 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    {item.title}

                    {item.sub && item.sub.length > 0 && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}

                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-slate-800 group-hover:w-3/4 transition-all duration-300"></span>
                  </button>

                  {item.sub &&
                    item.sub.length > 0 &&
                    activeDropdown === index && (
                      <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-slideDown z-50">
                        <div className="py-2">
                          {item.sub.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={() =>
                                handleNavigation(
                                  subItem.url || subItem.slug || "/",
                                )
                              }
                              className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                              {subItem.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 z-50 sm:w-96  bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-slideDown">
                    <div className="p-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSearchSubmit();
                            }
                          }}
                          placeholder="Search products..."
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                          autoFocus
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">
                          Popular Searches
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {["Electronics", "Fashion", "Home Decor"].map(
                            (term) => (
                              <button
                                key={term}
                                type="button"
                                onClick={() => {
                                  setSearchQuery(term);
                                  handleNavigation(`/search?q=${term}`);
                                  setIsSearchOpen(false);
                                }}
                                className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                              >
                                {term}
                              </button>
                            ),
                          )}
                        </div>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onCartClick}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all relative"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart?.items?.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cart?.items?.length > 9 ? "9+" : cart?.items?.length}
                  </span>
                )}
              </button>

              <div className="relative h-full flex items-center">
                {!loading && isAuth ? (
                  <button
                    onClick={toggleAccountDropdown}
                    className="flex items-center gap-2 px-1 md:px-3 h-9 md:h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700">
                        Account
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.phone}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden lg:block" />
                  </button>
                ) : (
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="flex items-center px-2 md:px-4 h-9 md:h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <span className="text-xs md:text-base font-bold text-gray-700">
                      Login
                    </span>
                  </button>
                )}
                {isAccountDropdownOpen && (
                  <Menudropdown
                    user={user}
                    logoutUser={logoutUser}
                    setIsAccountDropdownOpen={setIsAccountDropdownOpen}
                  />
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all lg:hidden"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white animate-slideDown">
            <div className="px-4 py-3 space-y-1">
              {sortedMenus.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() => {
                      if (item.sub && item.sub.length > 0) {
                        setActiveDropdown(
                          activeDropdown === index ? null : index,
                        );
                      } else {
                        handleNavigation(item.slug || "/");
                      }
                    }}
                    className="flex items-center justify-between w-full text-left px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors"
                  >
                    {item.title}
                    {item.sub && item.sub.length > 0 && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {item.sub &&
                    item.sub.length > 0 &&
                    activeDropdown === index && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.sub.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() =>
                              handleNavigation(
                                subItem.url || subItem.slug || "/",
                              )
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            {subItem.title}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              <button
                onClick={() => handleNavigation("/profile")}
                className="block w-full text-left px-4 py-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors sm:hidden"
              >
                Profile
              </button>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
