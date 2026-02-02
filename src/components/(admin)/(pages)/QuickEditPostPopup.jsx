"use client";

import React, { useEffect, useState } from "react";
import {
  X, FileText, Globe, Eye, Edit3, Save, Tag, Hash, Image as Img, Upload
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function QuickEditPostPopup({
  isOpen,
  onClose,
  post,
  onSave,
  btnLoading = false,
  categories = [],
  subcategories = []
}) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    category: "",
    subcategory: "",
    tags: [],
    status: "draft",
    featuredImage: null, // file object
  });

  const [featuredImagePreview, setFeaturedImagePreview] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [errors, setErrors] = useState({});

  // Load existing post
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        description: post.description || "",
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        category: post.category?._id || post.category || "",
        subcategory: post.subcategory?._id || post.subcategory || "",
        tags: post.tags || [],
        status: post.status || "draft",
        featuredImage: null,
      });

      if (post.featuredImage) {
        setFeaturedImagePreview(post.featuredImage);
      }
    }
  }, [post]);

  // Slug generator
  const generateSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleTitle = (val) => {
    setFormData((p) => ({ ...p, title: val, slug: generateSlug(val) }));
  };

  const handleSlug = (val) => {
    setFormData((p) => ({ ...p, slug: generateSlug(val) }));
  };

  // Tags
  const handleTagAdd = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((p) => ({ ...p, tags: [...p.tags, tag] }));
    }
    setTagInput("");
  };

  const handleTagRemove = (tag) => {
    setFormData((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  };

  // Category & Subcategory filter
  useEffect(() => {
    if (formData.category) {
      const subs = subcategories.filter(
        (s) => s.parentCategory?._id === formData.category
      );
      setAvailableSubcategories(subs);
    } else {
      setAvailableSubcategories([]);
    }
  }, [formData.category, subcategories]);

  // Featured Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((p) => ({ ...p, featuredImage: file }));
    setFeaturedImagePreview(URL.createObjectURL(file));
  };

  // Validation
  const validate = () => {
    let err = {};
    if (!formData.title.trim()) err.title = "Title required";
    if (!formData.slug.trim()) err.slug = "Slug required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Save
  const handleSave = () => {
    if (!validate()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Edit3 size={20} className="text-blue-600" />
            <h2 className="text-xl font-semibold">Quick Edit Post</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT (Main Fields) */}
          <div className="lg:col-span-2 space-y-6">

            {/* TITLE */}
            <div>
              <label className="text-sm font-medium">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded mt-1"
              />
              {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>

            {/* SLUG */}
            <div>
              <label className="text-sm font-medium">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleSlug(e.target.value)}
                className="w-full border px-3 py-2 rounded mt-1"
              />
              {errors.slug && <p className="text-red-500">{errors.slug}</p>}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-medium">Description</label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(v) => setFormData((p) => ({ ...p, description: v }))}
                className="mt-2"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, category: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded mt-1"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option value={c._id} key={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBCATEGORY */}
            {availableSubcategories.length > 0 && (
              <div>
                <label className="text-sm font-medium">Subcategory</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, subcategory: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded mt-1"
                >
                  <option value="">Select Subcategory</option>
                  {availableSubcategories.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* TAGS */}
            <div>
              <label className="text-sm font-medium">Tags</label>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 border px-3 py-2 rounded"
                />
                <button
                  onClick={handleTagAdd}
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                >
                  <Tag size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1"
                  >
                    #{t}
                    <button onClick={() => handleTagRemove(t)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO TITLE */}
            <div>
              <label className="text-sm font-medium">SEO Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, metaTitle: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            {/* SEO DESC */}
            <div>
              <label className="text-sm font-medium">SEO Description</label>
              <textarea
                rows="3"
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, metaDescription: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>
          </div>

          {/* RIGHT (Sidebar) */}
          <div className="space-y-6">

            {/* FEATURED IMAGE */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Img size={16} /> Featured Image
              </h3>

              {!featuredImagePreview ? (
                <label className="flex flex-col items-center justify-center border rounded-md p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <Upload size={20} className="text-gray-500 mb-2" />
                  <span className="text-sm text-gray-600">Upload Image</span>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={featuredImagePreview}
                    className="rounded-md w-full object-cover"
                  />
                  <button
                    onClick={() => {
                      setFeaturedImagePreview("");
                      setFormData((p) => ({ ...p, featuredImage: null }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* STATUS */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 flex items-center gap-2">
                <Eye size={16} /> Status
              </h3>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded mt-3"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="private">Private</option>
              </select>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={btnLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Save size={16} className="inline mr-1" />
            {btnLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
