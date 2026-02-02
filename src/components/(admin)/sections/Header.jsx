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
import Loading from "@/components/loading";

const Header = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [logo, setLogo] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [menus, setMenus] = useState([]);
  const [offers, setOffers] = useState({ isActive: true, items: [] });

  useEffect(() => {
    fetchHeaderData();
  }, []);

  const fetchHeaderData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Admin/header");
      const data = await res.json();

      if (data.data) {
        setLogo(data.data.logo || "");
        setLogoPreview(data.data.logo || "");
        setMenus(data.data.menus || []);
        setOffers(data.data.offers || { isActive: true, items: [] });
      }
    } catch (error) {
      console.error("Failed to fetch header:", error);
      setMessage({ type: "error", text: "Failed to load header data" });
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

  // Menu Management
  const addMenu = () => {
    setMenus((prev) => [
      ...prev,
      { title: "", slug: "", sub: [], order: prev.length, isActive: true },
    ]);
  };

  const updateMenu = (index, field, value) => {
    setMenus((prev) =>
      prev.map((menu, i) => (i === index ? { ...menu, [field]: value } : menu))
    );
  };

  const removeMenu = (index) => {
    setMenus((prev) => prev.filter((_, i) => i !== index));
  };

  const addSubMenu = (menuIndex) => {
    setMenus((prev) =>
      prev.map((menu, i) =>
        i === menuIndex
          ? { ...menu, sub: [...menu.sub, { title: "", slug: "", url: "" }] }
          : menu
      )
    );
  };

  const updateSubMenu = (menuIndex, subIndex, field, value) => {
    setMenus((prev) =>
      prev.map((menu, i) =>
        i === menuIndex
          ? {
              ...menu,
              sub: menu.sub.map((subItem, j) =>
                j === subIndex ? { ...subItem, [field]: value } : subItem
              ),
            }
          : menu
      )
    );
  };

  const removeSubMenu = (menuIndex, subIndex) => {
    setMenus((prev) =>
      prev.map((menu, i) =>
        i === menuIndex
          ? { ...menu, sub: menu.sub.filter((_, j) => j !== subIndex) }
          : menu
      )
    );
  };

  // Offer Management
  const addOffer = () => {
    setOffers((prev) => ({
      ...prev,
      items: [...prev.items, { title: "", url: "", color: "#000000" }],
    }));
  };

  const updateOffer = (index, field, value) => {
    setOffers((prev) => ({
      ...prev,
      items: prev.items.map((offer, i) =>
        i === index ? { ...offer, [field]: value } : offer
      ),
    }));
  };

  const removeOffer = (index) => {
    setOffers((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handlePublish = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();

      formData.append("menus", JSON.stringify(menus));
      formData.append("offers", JSON.stringify(offers));
      formData.append("logo", logo);

      if (logoFile) {
        formData.append("logoFile", logoFile);
      }

      const res = await fetch("/api/Admin/header", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => fetchHeaderData(), 1000);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to publish header" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
   <Loading/>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Header CMS</h1>
          <p className="text-gray-600 mt-1">
            Manage your website header content
          </p>
        </div>
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
          {saving ? "Publishing..." : "Publish Header"}
        </button>
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
          Header Logo
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

      {/* Menus Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Navigation Menus
          </h2>
          <button
            onClick={addMenu}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Add Menu
          </button>
        </div>

        <div className="space-y-4">
          {menus.map((menu, menuIndex) => (
            <MenuItem
              key={menuIndex}
              menu={menu}
              menuIndex={menuIndex}
              updateMenu={updateMenu}
              removeMenu={removeMenu}
              addSubMenu={addSubMenu}
              updateSubMenu={updateSubMenu}
              removeSubMenu={removeSubMenu}
            />
          ))}
          {menus.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No menus yet. Add one to get started.
            </p>
          )}
        </div>
      </div>

      {/* Offers Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Top Bar Offers
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setOffers((prev) => ({ ...prev, isActive: !prev.isActive }))
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                offers.isActive
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {offers.isActive ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              Offers {offers.isActive ? "Active" : "Inactive"}
            </button>
            <button
              onClick={addOffer}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-5 h-5" /> Add Offer
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {offers.items.map((offer, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <input
                type="text"
                value={offer.title}
                onChange={(e) => updateOffer(index, "title", e.target.value)}
                placeholder="Offer text (e.g., Free Shipping on Orders Over $50)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="url"
                value={offer.url}
                onChange={(e) => updateOffer(index, "url", e.target.value)}
                placeholder="Link URL (optional)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Color:</label>
                <input
                  type="color"
                  value={offer.color}
                  onChange={(e) => updateOffer(index, "color", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              <button
                onClick={() => removeOffer(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {offers.items.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No offers added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({
  menu,
  menuIndex,
  updateMenu,
  removeMenu,
  addSubMenu,
  updateSubMenu,
  removeSubMenu,
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
        <GripVertical className="w-5 h-5 text-gray-400" />
        <input
          type="number"
          value={menu.order}
          onChange={(e) =>
            updateMenu(menuIndex, "order", parseInt(e.target.value) || 0)
          }
          placeholder="Order"
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          value={menu.title}
          onChange={(e) => updateMenu(menuIndex, "title", e.target.value)}
          placeholder="Menu Title (e.g., Shop)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          value={menu.slug}
          onChange={(e) => updateMenu(menuIndex, "slug", e.target.value)}
          placeholder="Slug (e.g., /shop)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={() => updateMenu(menuIndex, "isActive", !menu.isActive)}
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
          onClick={() => removeMenu(menuIndex)}
          className="p-2 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Sub-Menus</h4>
          {menu.sub.map((subItem, subIndex) => (
            <div
              key={subIndex}
              className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={subItem.title}
                onChange={(e) =>
                  updateSubMenu(menuIndex, subIndex, "title", e.target.value)
                }
                placeholder="Title"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                value={subItem.slug}
                onChange={(e) =>
                  updateSubMenu(menuIndex, subIndex, "slug", e.target.value)
                }
                placeholder="Slug"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                value={subItem.url}
                onChange={(e) =>
                  updateSubMenu(menuIndex, subIndex, "url", e.target.value)
                }
                placeholder="URL"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => removeSubMenu(menuIndex, subIndex)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addSubMenu(menuIndex)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Sub-Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;