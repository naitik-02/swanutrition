"use client";
import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Home,
  ShoppingBag,
  User,
  Settings,
  HelpCircle,
  FileText,
  Award,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import { useUser } from "@/context/user";
import { useSettingContext } from "@/context/setting";

const ModernFooter = () => {
  const { setting } = useSettingContext();
  const { isAuth } = useUser();

  const socials = setting?.socials || [];

  const getLink = (platform) =>
    socials.find((s) => s.platform.toLowerCase() === platform)?.link;

  const footerData = {
    company: {
      name: "FreshMart",
      description: `${setting?.footerDescription1}`,
      description2: `${setting?.footerDescription2}`,
      tagline: "Fresh • Fast • Reliable",
    },
    quickLinks: [
      { name: "About Us", icon: HelpCircle, url: "/about-us" },
      { name: "Blogs", icon: HelpCircle, url: "/Blogs" },
      { name: "Privacy", icon: HelpCircle, url: "/privacy" },
      { name: "Terms", icon: HelpCircle, url: "/terms" },
      { name: "Faq", icon: HelpCircle, url: "/faqs" },
      { name: "Contact", icon: HelpCircle, url: "/contact" },
      { name: "Security", icon: HelpCircle, url: "/security" },
      { name: "Seller", icon: HelpCircle, url: "/seller" },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-500 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Freecart</h3>
            </div>

            <div
              className="text-gray-600 text-sm leading-relaxed max-w-sm"
              dangerouslySetInnerHTML={{
                __html: footerData.company.description,
              }}
            />

            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-md text-xs font-medium">
              <Award className="h-3.5 w-3.5" />
              {footerData.company.tagline}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900">
              Quick Links
            </h4>

            <div className="grid grid-cols-3 gap-6">
              {[
                // 3 column me split:
                footerData.quickLinks.slice(0, 6),
                footerData.quickLinks.slice(6, 12),
                footerData.quickLinks.slice(12, 18),
              ].map((column, colIndex) => (
                <ul key={colIndex} className="space-y-2.5">
                  {column.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.url}
                        className="group flex items-center gap-1.5 text-gray-600 hover:text-orange-600 transition-colors text-sm"
                      >
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-gray-900">
              Connect With Us
            </h4>
            <div className="flex items-center gap-2.5">
              {getLink("facebook") && (
                <a
                  href={getLink("facebook")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-orange-500 flex items-center justify-center transition-all duration-200 group"
                  title="Facebook"
                >
                  <Facebook className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </a>
              )}

              {getLink("twitter") && (
                <a
                  href={getLink("twitter")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-orange-500 flex items-center justify-center transition-all duration-200 group"
                  title="Twitter"
                >
                  <Twitter className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </a>
              )}

              {getLink("instagram") && (
                <a
                  href={getLink("instagram")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-orange-500 flex items-center justify-center transition-all duration-200 group"
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </a>
              )}

              {getLink("linkedin") && (
                <a
                  href={getLink("linkedin")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-orange-500 flex items-center justify-center transition-all duration-200 group"
                  title="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              <p
                dangerouslySetInnerHTML={{
                  __html: footerData.company.description2,
                }}
              ></p>
            </div>

            {/* Download App */}
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-gray-700 font-medium">
                Download App
              </span>

              <div className="flex items-center gap-2">
                <img
                  src="https://blinkit.com/d61019073b700ca49d22.png"
                  alt="App Store"
                  className="h-8 sm:h-9 cursor-pointer hover:opacity-80 transition-opacity"
                />

                <img
                  src="https://blinkit.com/d61019073b700ca49d22.png"
                  alt="Google Play"
                  className="h-8 sm:h-9 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
