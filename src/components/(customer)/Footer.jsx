"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  MessageCircle,
  LocateIcon,
} from "lucide-react";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  const socialIcons = {
    facebook: <Facebook size={18} />,
    youtube: <Youtube size={18} />,
    instagram: <Instagram size={18} />,
    twitter: <Twitter size={18} />,
    LocateIcon: <LocateIcon size={18} />,
    email: <Mail size={18} />,
    message: <MessageCircle size={18} />,
  };

  const info = footerData?.info || [];
  const email =
    info.find((x) => x.title.toLowerCase() === "email")?.value || "";

  const address =
    info.find((x) => x.title.toLowerCase() === "address")?.value || "";

  const whatsapp =
    info.find((x) => x.title.toLowerCase() === "whatsapp")?.value || "";

  const copyright =
    info.find((x) => x.title.toLowerCase() === "copyright")?.value || "";


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

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            {footerData?.logo ? (
              <div className="relative  h-20">
                <Image
                  src={footerData.logo}
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
              </div>
            ) : null}
            <div className="space-y-3 text-sm text-gray-600">
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="mt-1 flex-shrink-0 text-gray-400"
                  />
                  <p>{address}</p>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="flex-shrink-0 text-gray-400" />
                  <a
                    href="mailto:orders@centrumshop.in"
                    className="hover:text-gray-900 transition-colors"
                  >
                    {email}
                  </a>
                </div>
              )}
              {whatsapp && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0 text-gray-400" />
                  <a
                    href="tel:+917065089185"
                    className="hover:text-gray-900 transition-colors"
                  >
                    {whatsapp}
                  </a>
                </div>
              )}
            </div>
          </div>

          {footerData?.menus?.map((menu, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-4">{menu.title}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {menu.items?.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.url}
                      className="hover:text-gray-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Connect With Us
            </h3>
            <div className="flex gap-4">
              {footerData?.socials?.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all"
                >
                  {socialIcons[social.platform?.toLowerCase()] ||
                    social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">{copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
