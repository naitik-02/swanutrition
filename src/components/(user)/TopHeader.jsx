import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { useSettingContext } from "@/context/setting";

// Demo component with mock data
const TopHeader = () => {

    const { setting } = useSettingContext();
  
  // const setting = {
  //   helpline: "9876543210",
  //   email: "support@example.com",
  //   open_time: "9",
  //   close_time: "6",
  //   socials: [
  //     { platform: "facebook", link: "https://facebook.com" },
  //     { platform: "twitter", link: "https://twitter.com" },
  //     { platform: "instagram", link: "https://instagram.com" },
  //   ],
  // };

  const socials = setting?.socials || [];
  const getLink = (platform) =>
    socials.find((s) => s.platform.toLowerCase() === platform)?.link;

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-2.5 gap-2 md:gap-0">
          {/* Left Section - Contact Info */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-5 text-sm">
            {/* Phone */}
            <a
              href={`tel:+91${setting?.helpline}`}
              className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-600 transition-colors duration-200 group"
            >
              <div className="p-1 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium">
                +91-{setting?.helpline || ""}
              </span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${setting?.email}`}
              className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-600 transition-colors duration-200 group"
            >
              <div className="p-1 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <Mail className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium">
                {setting?.email || ""}
              </span>
            </a>

            {/* Hours */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600">
              <div className="p-1 rounded-full bg-amber-50">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <span className="text-xs sm:text-sm font-medium">
                {setting?.open_time && setting?.close_time
                  ? `${setting.open_time}:00 AM - ${setting.close_time}:00 PM`
                  : ""}
              </span>
            </div>
          </div>

          {/* Right Section - CTA & Social Links */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Create Store Button */}
            <button
              onClick={() => console.log("Navigate to /seller")}
              className="text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Store
            </button>

            {/* Social Links */}
            <div className="hidden lg:flex items-center gap-1">
              <span className="text-slate-500 text-xs font-semibold mr-1">
                Follow:
              </span>
              <div className="flex items-center gap-1">
                {getLink("facebook") && (
                  <a
                    href={getLink("facebook")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-blue-100 text-slate-500 hover:text-blue-600 transition-all duration-200 transform hover:scale-110"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {getLink("twitter") && (
                  <a
                    href={getLink("twitter")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-sky-100 text-slate-500 hover:text-sky-500 transition-all duration-200 transform hover:scale-110"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {getLink("instagram") && (
                  <a
                    href={getLink("instagram")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-pink-100 text-slate-500 hover:text-pink-600 transition-all duration-200 transform hover:scale-110"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {getLink("linkedin") && (
                  <a
                    href={getLink("linkedin")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-blue-100 text-slate-500 hover:text-blue-700 transition-all duration-200 transform hover:scale-110"
                    aria-label="Connect on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;