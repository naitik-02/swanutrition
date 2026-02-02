"use client";
import React, { useState } from "react";
import { ArrowLeft, Eye, FileText, Globe, Tag } from "lucide-react";
import { usePageContext } from "@/context/pages";

const AddPageForm = () => {
  const { createPage, btnLoading } = usePageContext();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    design:"",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    status: "draft",
  });
  const [errors, setErrors] = useState({});

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
    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
  };

  const handleSlugChange = (value) => {
    const cleanSlug = generateSlug(value);
    setFormData((prev) => ({ ...prev, slug: cleanSlug }));
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    try {
      const payload = {
        ...formData,
        metaKeywords: formData.metaKeywords
          ? formData.metaKeywords.split(",").map((kw) => kw.trim())
          : [],
      };
      await createPage(payload);
      
      setFormData({
        title: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        design:"",
        status: "draft",
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating page:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add New Page
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Create a new page for your website
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={btnLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Eye size={16} />
            {btnLoading
              ? "Saving..."
              : formData.status === "published"
              ? "Publish"
              : "Save as Draft"}
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left side */}
          <div className="lg:col-span-3 space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                  errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
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
                    errors.slug ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="page-slug"
                />
              </div>
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
              )}
            </div>

            {/* SEO Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaTitle: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Meta title (SEO)"
              />
            </div>

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


          {/* Right side */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Eye size={16} />
                  Status
                </h3>
              </div>
              <div className="p-4">
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
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.status === "draft"
                    ? "Page will be saved as draft"
                    : formData.status === "private"
                    ? "Page will be private"
                    : "Page will be live and public"}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "draft" }))
                  }
                  className="w-full px-4 py-2 text-left text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm"
                >
                  📝 Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: "published" }))
                  }
                  className="w-full px-4 py-2 text-left text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors text-sm"
                >
                  🚀 Set to Publish
                </button>
              </div>
            </div>

            {/* Page Preview */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                📄 Page Preview
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Title:</strong> {formData.title || "Untitled"}
                </p>
                <p>
                  <strong>URL:</strong> /{formData.slug || "page-slug"}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`ml-1 px-2 py-1 rounded text-xs ${
                      formData.status === "published"
                        ? "bg-green-100 text-green-800"
                        : formData.status === "private"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {formData.status.charAt(0).toUpperCase() +
                      formData.status.slice(1)}
                  </span>
                </p>
                <p>
                  <strong>SEO Title:</strong> {formData.metaTitle || "Not set"}
                </p>
                <p>
                  <strong>SEO Description:</strong>{" "}
                  {formData.metaDescription || "Not set"}
                </p>
                <p>
                  <strong>SEO Keywords:</strong>{" "}
                  {formData.metaKeywords || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPageForm;
