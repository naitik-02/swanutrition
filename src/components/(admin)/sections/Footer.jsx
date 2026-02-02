"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Footer = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [logo, setLogo] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [menus, setMenus] = useState([]);
  const [socials, setSocials] = useState([]);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Admin/cms/footer");
      const data = await res.json();

      if (data.data) {
        setLogo(data.data.logo || "");
        setLogoPreview(data.data.logo || "");
        setIsActive(data.data.isActive ?? true);
        setMenus(data.data.menus || []);
        setSocials(data.data.socials || []);
        setInfo(data.data.info || []);
      }
    } catch (error) {
      console.error("Failed to fetch footer:", error);
      setMessage({ type: "error", text: "Failed to load footer data" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const addMenuList = () => {
    setMenus((prev) => [...prev, { title: "", items: [], isActive: true }]);
  };

  const updateMenuList = (index, field, value) => {
    setMenus((prev) =>
      prev.map((menu, i) => (i === index ? { ...menu, [field]: value } : menu))
    );
  };

  const removeMenuList = (index) => {
    setMenus((prev) => prev.filter((_, i) => i !== index));
  };

  const addMenuItem = (menuIndex) => {
    setMenus((prev) =>
      prev.map((menu, i) =>
        i === menuIndex
          ? {
              ...menu,
              items: [
                ...menu.items,
                {
                  label: "",
                  url: "",
                  isActive: true,
                  order: menu.items.length,
                },
              ],
            }
          : menu
      )
    );
  };

  const updateMenuItem = (menuIndex, itemIndex, field, value) => {
    setMenus((prev) =>
      prev.map((menu, i) =>
        i === menuIndex
          ? {
              ...menu,
              items: menu.items.map((item, j) =>
                j === itemIndex ? { ...item, [field]: value } : item
              ),
            }
          : menu
      )
    );
  };

  const removeMenuItem = (menuIndex, itemIndex) => {
    setMenus((prev) =>
      prev.map((menu, i) =>
        i === menuIndex
          ? { ...menu, items: menu.items.filter((_, j) => j !== itemIndex) }
          : menu
      )
    );
  };

  // Social Management
  const addSocial = () => {
    setSocials((prev) => [
      ...prev,
      { platform: "", url: "", isActive: true, order: prev.length },
    ]);
  };

  const updateSocial = (index, field, value) => {
    setSocials((prev) =>
      prev.map((social, i) =>
        i === index ? { ...social, [field]: value } : social
      )
    );
  };

  const removeSocial = (index) => {
    setSocials((prev) => prev.filter((_, i) => i !== index));
  };

  // Info Management
  const addInfo = () => {
    setInfo((prev) => [...prev, { title: "", value: "" }]);
  };

  const updateInfo = (index, field, value) => {
    setInfo((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeInfo = (index) => {
    setInfo((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();

      formData.append("menus", JSON.stringify(menus));
      formData.append("socials", JSON.stringify(socials));
      formData.append("info", JSON.stringify(info));
      formData.append("isActive", JSON.stringify(isActive));
      formData.append("logo", logo);

      if (logoFile) {
        formData.append("logoFile", logoFile);
      }

      const res = await fetch("/api/Admin/cms/footer", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => fetchFooterData(), 1000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to publish footer" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Footer CMS</h1>
          <p className="text-gray-600 mt-1">
            Manage your website footer content
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              isActive
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            {isActive ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
            Footer {isActive ? "Active" : "Inactive"}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Publishing..." : "Publish Footer"}
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Logo Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Footer Logo
        </h2>
        <div className="flex items-center gap-4">
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo"
              className="w-32 h-32 object-contain border rounded-lg p-2"
            />
          )}
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
            <Upload className="w-4 h-4" />
            {logoPreview ? "Change Logo" : "Upload Logo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Menu Lists */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Menu Lists</h2>
          <button
            onClick={addMenuList}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Menu List
          </button>
        </div>

        <div className="space-y-4">
          {menus.map((menu, menuIndex) => (
            <MenuListItem
              key={menuIndex}
              menu={menu}
              menuIndex={menuIndex}
              updateMenuList={updateMenuList}
              removeMenuList={removeMenuList}
              addMenuItem={addMenuItem}
              updateMenuItem={updateMenuItem}
              removeMenuItem={removeMenuItem}
            />
          ))}
          {menus.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No menu lists yet. Add one to get started.
            </p>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
          <button
            onClick={addSocial}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-5 h-5" /> Add Social Link
          </button>
        </div>

        <div className="space-y-3">
          {socials.map((social, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={social.order}
                onChange={(e) =>
                  updateSocial(index, "order", parseInt(e.target.value) || 0)
                }
                placeholder="Order"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={social.platform}
                onChange={(e) =>
                  updateSocial(index, "platform", e.target.value)
                }
                placeholder="Platform (e.g., Facebook)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="url"
                value={social.url}
                onChange={(e) => updateSocial(index, "url", e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() =>
                  updateSocial(index, "isActive", !social.isActive)
                }
                className={`p-2 rounded ${
                  social.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {social.isActive ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => removeSocial(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Footer Information
          </h2>
          <button
            onClick={addInfo}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-5 h-5" /> Add Info Item
          </button>
        </div>

        <div className="space-y-4">
          {info.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateInfo(index, "title", e.target.value)}
                  placeholder="Title (e.g., Copyright, Address)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => removeInfo(index)}
                  className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={item.value}
                onChange={(e) => updateInfo(index, "value", e.target.value)}
                placeholder="Content..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MenuListItem = ({
  menu,
  menuIndex,
  updateMenuList,
  removeMenuList,
  addMenuItem,
  updateMenuItem,
  removeMenuItem,
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3 p-4 bg-gray-50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-gray-200 rounded"
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        <input
          type="text"
          value={menu.title}
          onChange={(e) => updateMenuList(menuIndex, "title", e.target.value)}
          placeholder="Menu Title (e.g., Quick Links)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={() => updateMenuList(menuIndex, "isActive", !menu.isActive)}
          className={`p-2 rounded ${
            menu.isActive
              ? "bg-green-100 text-green-600"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {menu.isActive ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => removeMenuList(menuIndex)}
          className="p-2 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-3">
          {menu.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={item.order}
                onChange={(e) =>
                  updateMenuItem(
                    menuIndex,
                    itemIndex,
                    "order",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Order"
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                value={item.label}
                onChange={(e) =>
                  updateMenuItem(menuIndex, itemIndex, "label", e.target.value)
                }
                placeholder="Label"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                value={item.url}
                onChange={(e) =>
                  updateMenuItem(menuIndex, itemIndex, "url", e.target.value)
                }
                placeholder="URL"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() =>
                  updateMenuItem(
                    menuIndex,
                    itemIndex,
                    "isActive",
                    !item.isActive
                  )
                }
                className={`p-1 rounded ${
                  item.isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {item.isActive ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => removeMenuItem(menuIndex, itemIndex)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addMenuItem(menuIndex)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>
      )}
    </div>
  );
};

export default Footer;
