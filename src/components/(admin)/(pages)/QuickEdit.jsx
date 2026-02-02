"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, Globe, Eye, Edit3, Save, Tag } from "lucide-react";

const QuickEditPopup = ({ 
  isOpen, 
  onClose, 
  page, 
  onSave, 
  btnLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    design:"",
    metaDescription: "",
    metaKeywords: "",
    status: "published",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || page.name || "",
        slug: page.slug || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        metaKeywords: Array.isArray(page.metaKeywords) 
          ? page.metaKeywords.join(", ") 
          : page.metaKeywords || "",
        status: page.status || "published",
      });
    }
  }, [page]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));

    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleSlugChange = (value) => {
    const cleanSlug = generateSlug(value);
    setFormData((prev) => ({ ...prev, slug: cleanSlug }));

    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Page title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (onSave) {
      // Convert metaKeywords string back to array
      const payload = {
        ...formData,
        metaKeywords: formData.metaKeywords
          ? formData.metaKeywords.split(",").map((kw) => kw.trim())
          : [],
      };
      onSave(payload);
    }
  };

  const handleEditTemplate = () => {
    if (page?.slug) {
      window.open(`/admin/page/update/${page.slug}`, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Edit3 size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Quick Edit Page
                </h2>
                <p className="text-sm text-gray-600">
                  Make quick changes to your page
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="inline mr-1" />
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.title
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter page title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe size={16} className="inline mr-1" />
                    Page Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                      yoursite.com/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className={`flex-1 px-3 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.slug
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="page-slug"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    The slug is the URL-friendly version of the page name
                  </p>
                </div>

                {/* SEO Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} className="inline mr-1" />
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Meta title (SEO)"
                  />
                </div>

                {/* SEO Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    rows="3"
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        metaDescription: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Meta description (SEO)"
                  />
                </div>

                {/* SEO Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.metaKeywords}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        metaKeywords: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate multiple keywords with commas
                  </p>
                </div>

                <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Design
  </label>

  <select
    value={formData.design}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        design: e.target.value,
      }))
    }
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    <option value="">Select design</option>
    <option value="v1">Design V1</option>
    <option value="v2">Design V2</option>
  </select>
</div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* Status Settings */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Eye size={16} />
                      Status
                    </h3>
                  </div>
                  <div className="p-3">
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="private">Private</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.status === "draft"
                        ? "Page is saved as draft"
                        : formData.status === "private"
                        ? "Page is private"
                        : "Page is live and public"}
                    </p>
                  </div>
                </div>

                {/* Page Preview */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm">
                    📄 Page Preview
                  </h4>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p>
                      <strong>Title:</strong> {formData.title || "Untitled Page"}
                    </p>
                    <p>
                      <strong>URL:</strong> /{formData.slug || "page-slug"}
                    </p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        formData.status === "published" 
                          ? "bg-green-100 text-green-800"
                          : formData.status === "private"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                      </span>
                    </p>
                    <p>
                      <strong>SEO Title:</strong> {formData.metaTitle || "Not set"}
                    </p>
                    <p>
                      <strong>SEO Description:</strong> {formData.metaDescription || "Not set"}
                    </p>
                    <p>
                      <strong>SEO Keywords:</strong> {formData.metaKeywords || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleEditTemplate}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
            >
              <Edit3 size={16} />
              Edit Template
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={btnLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
              >
                <Save size={16} />
                {btnLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickEditPopup;