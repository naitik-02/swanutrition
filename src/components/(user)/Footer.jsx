import React, { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  ChevronRight,
  Award,
  Youtube,
  Github,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useCategoryContext } from "@/context/category";

const ModernFooter = () => {
  const { categories } = useCategoryContext();
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const res = await fetch("/api/User/footer");
      const data = await res.json();
      if (data.data) {
        setFooterData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch footer:", error);
    } finally {
      setLoading(false);
    }
  };

  // Social icon mapping
  const getSocialIcon = (platform) => {
    const platformLower = platform?.toLowerCase() || "";
    const iconProps = { className: "h-4 w-4 text-gray-600 group-hover:text-white transition-colors" };
    
    if (platformLower.includes("facebook")) return <Facebook {...iconProps} />;
    if (platformLower.includes("twitter") || platformLower.includes("x")) return <Twitter {...iconProps} />;
    if (platformLower.includes("instagram")) return <Instagram {...iconProps} />;
    if (platformLower.includes("linkedin")) return <Linkedin {...iconProps} />;
    if (platformLower.includes("youtube")) return <Youtube {...iconProps} />;
    if (platformLower.includes("github")) return <Github {...iconProps} />;
    if (platformLower.includes("email") || platformLower.includes("mail")) return <Mail {...iconProps} />;
    if (platformLower.includes("phone") || platformLower.includes("whatsapp")) return <Phone {...iconProps} />;
    return <Globe {...iconProps} />;
  };

  // Get info by title
  const getInfoByTitle = (title) => {
    return footerData?.info?.find(
      (item) => item.title.toLowerCase() === title.toLowerCase()
    )?.value || "";
  };

  const displayCategories = Array.isArray(categories)
    ? categories.slice(0, 12)
    : [];
  const hasMoreCategories = Array.isArray(categories) && categories.length > 12;

  if (loading) {
    return (
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  if (!footerData) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Company Info - 4 columns */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              {footerData.logo ? (
                <img
                  src={footerData.logo}
                  alt="Company Logo"
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                    Freecart
                  </h3>
                </>
              )}
            </div>

            {/* Description */}
            {getInfoByTitle("description") && (
              <div
                className="text-gray-600 text-sm mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: getInfoByTitle("description"),
                }}
              />
            )}

            {/* Tagline */}
            {getInfoByTitle("tagline") && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium mb-6">
                <Award className="h-3.5 w-3.5" />
                {getInfoByTitle("tagline")}
              </div>
            )}

            {/* Social Media */}
            {footerData.socials && footerData.socials.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Follow Us
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {footerData.socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-orange-500 flex items-center justify-center transition-all duration-300 group"
                      title={social.platform}
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Menu Lists */}
          {footerData.menus && footerData.menus.length > 0 && (
            <>
              {footerData.menus.map((menu, menuIndex) => (
                <div
                  key={menuIndex}
                  className={`lg:col-span-${
                    footerData.menus.length === 1 ? 4 : 3
                  }`}
                >
                  <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                    {menu.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {menu.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          href={item.url || "#"}
                          className="group flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors text-sm"
                        >
                          <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}

          {/* Categories - Only if menus don't take full space */}
          {categories && categories.length > 0 && (
            <div className="lg:col-span-4">
              <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                <Link
                  href="/categories"
                  className="hover:text-orange-600 transition-colors"
                >
                  Categories
                </Link>
              </h4>
              <div className="grid grid-cols-1 gap-y-2.5">
                {displayCategories.map((category, index) => (
                  <Link
                    key={index}
                    href={`/category/${category.slug}`}
                    className="group text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center gap-2"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all" />
                    <span className="truncate">{category.name}</span>
                  </Link>
                ))}
              </div>
              {hasMoreCategories && (
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  View All Categories
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            {/* Left Side - Copyright */}
            <div className="text-sm text-gray-600 text-center md:text-left">
              {getInfoByTitle("copyright") ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: getInfoByTitle("copyright"),
                  }}
                ></p>
              ) : (
                <p>© {new Date().getFullYear()} All rights reserved.</p>
              )}
            </div>

            {/* Right Side - App Downloads */}
            {getInfoByTitle("appstore") || getInfoByTitle("playstore") ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium whitespace-nowrap">
                  Download App
                </span>
                <div className="flex items-center gap-2">
                  {getInfoByTitle("appstore") && (
                    <a
                      href={getInfoByTitle("appstore")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://blinkit.com/d61019073b700ca49d22.png"
                        alt="App Store"
                        className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </a>
                  )}
                  {getInfoByTitle("playstore") && (
                    <a
                      href={getInfoByTitle("playstore")}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://blinkit.com/d61019073b700ca49d22.png"
                        alt="Google Play"
                        className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </a>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;