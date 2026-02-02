"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  X,
  Upload,
  Settings,
  Calendar,
  Share2,
  FileText,
} from "lucide-react";
import { useSettingContext } from "@/context/setting";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

const Page = () => {
  const [helpline, setHelpline] = useState("");
  const [title, setTitle] = useState("");

  const [tagline, setTagline] = useState("");
  const [searchEnginevisibility, setSearchEnginevisibility] = useState();
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [openTime, setOpenTime] = useState();
  const [closeTime, setCloseTime] = useState();
  const [helpCenterLink, setHelpCenterLink] = useState("/help");
  const [logo, setLogo] = useState(null);
  const [storeStatus, setStoreStatus] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [logoPreview, setLogoPreview] = useState("");
  const [footerDescription1, setFooterDescription1] = useState("");
  const [footerDescription2, setFooterDescription2] = useState("");
  const [footerYear, setFooterYear] = useState(new Date().getFullYear());
  const [socials, setSocials] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const { setting, createSetting, updateSetting, loading, btnLoading } =
    useSettingContext();

  console.log("Settings:", setting);

  useEffect(() => {
    if (setting) {
      setTitle(setting.title || "");
      setTagline(setting.tagline || "");
      setSearchEnginevisibility(setting.search_engine_visibility || false);
      setHelpline(setting.helpline || "");
      setEmail(setting.email || "");
      setWhatsapp(setting.whatsapp || "");
      setOpenTime(setting.open_time);
      setCloseTime(setting.close_time);
      setStoreStatus(setting.store_status || "");
      setPaymentMethod(setting.payment_method || "");
      setHelpCenterLink(setting.helpCenterLink || "/help");
      setLogoPreview(setting.logo || "");
      setFooterDescription1(setting.footerDescription1 || "");
      setFooterDescription2(setting.footerDescription2 || "");
      setFooterYear(setting.footerYear || new Date().getFullYear());
      setSocials(setting.socials || []);
      setIsEditing(true);
    }
  }, [setting]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview("");
    const fileInput = document.getElementById("logo-upload");
    if (fileInput) fileInput.value = "";
  };

  const addSocialLink = () => {
    setSocials([...socials, { platform: "", link: "" }]);
  };

  const updateSocialLink = (index, field, value) => {
    const updatedSocials = [...socials];
    updatedSocials[index][field] = value;
    setSocials(updatedSocials);
  };

  const removeSocialLink = (index) => {
    const updatedSocials = socials.filter((_, i) => i !== index);
    setSocials(updatedSocials);
  };

  const saveSettings = async () => {
    if (!helpline.trim()) {
      alert("Please enter a helpline number");
      return;
    }

    if (!email.trim()) {
      alert("Please enter an email address");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("tagline", tagline.trim());
      formData.append("searchEnginevisibility", searchEnginevisibility);
      formData.append("helpline", helpline.trim());
      formData.append("email", email.trim());
      formData.append("openTime", openTime);
      formData.append("closeTime", closeTime);
      formData.append("whatsapp", whatsapp.trim());
      formData.append("paymentMethod", paymentMethod.trim());
      formData.append("storeStatus", storeStatus);
      formData.append("helpCenterLink", helpCenterLink.trim());
      formData.append("footerDescription1", footerDescription1.trim());
      formData.append("footerDescription2", footerDescription2.trim());
      formData.append("footerYear", footerYear);

      if (logo) {
        formData.append("logo", logo);
      }

      const validSocials = socials.filter(
        (s) => s.platform.trim() && s.link.trim()
      );
      formData.append("socials", JSON.stringify(validSocials));

      if (isEditing && setting?._id) {
        await updateSetting(setting._id, formData);
      } else {
        console.log(formData);
        await createSetting(formData);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setTagline("");
    setSearchEnginevisibility();
    setHelpline("");
    setEmail("");
    setWhatsapp("");
    setOpenTime();
    setCloseTime();
    setHelpCenterLink("/help");
    setLogo(null);
    setLogoPreview("");
    setFooterDescription1("");
    setFooterDescription2("");
    setFooterYear(new Date().getFullYear());
    setSocials([]);
    setIsEditing(false);
    const fileInput = document.getElementById("logo-upload");
    if (fileInput) fileInput.value = "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Settings Management
              </h1>
              <p className="text-gray-600">Configure your CMS settings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Basic Settings
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter helpline number"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    tagline *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter helpline number"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Helpline Number *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter helpline number"
                    value={helpline}
                    onChange={(e) => setHelpline(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter WhatsApp number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Help Center Link
                  </label>
                  <input
                    type="text"
                    placeholder="/help"
                    value={helpCenterLink}
                    onChange={(e) => setHelpCenterLink(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Time
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="w-1/2 rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    >
                      <option value="">Hour</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      value={""}
                      className="w-1/2 rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    >
                      <option value="AM">AM</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Closing Time
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="w-1/2 rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    >
                      <option value="">Hour</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      value={""}
                      className="w-1/2 rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    >
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="">Select a method</option>
                    <option value="COD">Cash on Delivery</option>
                    <option value="ONLINE">Online Payment</option>
                    <option value="BANK">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Store Status
                  </label>
                  <select
                    value={storeStatus}
                    onChange={(e) => setStoreStatus(e.target.value === "true")}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="">Select status</option>
                    <option value="true">Open</option>
                    <option value="false">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  {!logoPreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload logo
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-32 object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
                      />
                      <button
                        onClick={removeLogo}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Footer Settings
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Description 1
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={footerDescription1}
                    onChange={(content) => {
                      setFooterDescription1(content);
                    }}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        ["link", "image"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "link",
                      "image",
                    ]}
                   
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Description 2
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={footerDescription2}
                    onChange={(content) => {
                      setFooterDescription2(content);
                    }}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        ["link", "image"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "blockquote",
                      "list",
                      "bullet",
                      "link",
                      "image",
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Footer Year
                  </label>
                  <input
                    type="number"
                    placeholder="2024"
                    value={footerYear}
                    onChange={(e) =>
                      setFooterYear(
                        parseInt(e.target.value) || new Date().getFullYear()
                      )
                    }
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Search Engine Visibility
                  </label>

                  <input
                    type="checkbox"
                    checked={searchEnginevisibility}
                    onChange={(e) =>
                      setSearchEnginevisibility(e.target.checked)
                    }
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Share2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Social Media Links
                    </h2>
                  </div>
                  <button
                    onClick={addSocialLink}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Social
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {socials.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No social media links added yet
                  </div>
                ) : (
                  socials.map((social, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Social Link #{index + 1}
                        </span>
                        <button
                          onClick={() => removeSocialLink(index)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Platform (e.g., Facebook, Twitter)"
                          value={social.platform}
                          onChange={(e) =>
                            updateSocialLink(index, "platform", e.target.value)
                          }
                          className="w-full rounded-lg border-2 border-gray-200 py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                        />
                        <input
                          type="url"
                          placeholder="https://example.com"
                          value={social.link}
                          onChange={(e) =>
                            updateSocialLink(index, "link", e.target.value)
                          }
                          className="w-full rounded-lg border-2 border-gray-200 py-2 px-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex gap-3">
                <button
                  onClick={saveSettings}
                  disabled={btnLoading}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {btnLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {btnLoading
                    ? "Saving..."
                    : isEditing
                    ? "Update Settings"
                    : "Save Settings"}
                </button>

                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {socials.length}
              </div>
              <div className="text-sm text-gray-600">Social Media Links</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
