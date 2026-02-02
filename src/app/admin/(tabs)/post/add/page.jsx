"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Globe,
  FileText,
  Hash,
  Tag,
  Upload,
  X,
  Image as Img,
  Save,
  Eye,
} from "lucide-react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);
import { useRouter } from "next/navigation";

import { usePostCategoryContext } from "@/context/postCategory";
import { usePostSubCategoryContext } from "@/context/postSubCategory";
import { usePostContext } from "@/context/post";

export default function BlogPostForm() {
  const router = useRouter();

  const { postCategories, fetchPostCategories } = usePostCategoryContext();
  const { postSubcategories } = usePostSubCategoryContext();
  const { createPost, btnLoading } = usePostContext();

  const [formData, setFormData] = useState({
    title: "",
    metaTitle: "",
    description: "",
    slug: "",
    metaDescription: "",
    category: "",
    subcategory: "",
    tags: [],
    featuredImage: null,  
    status: "draft",
  });

  const [tagInput, setTagInput] = useState("");
  const [featuredImagePreview, setFeaturedImagePreview] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  useEffect(() => {
    fetchPostCategories();
  }, []);

  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Subcategory filtering
  useEffect(() => {
    if (formData.category) {
      const subs = postSubcategories.filter(
        (s) => s.parentCategory._id === formData.category
      );
      setAvailableSubcategories(subs);
    } else {
      setAvailableSubcategories([]);
    }
  }, [formData.category, postSubcategories]);

  // TAG ADD
  const handleTagAdd = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // ⭐ FIXED FILE UPLOAD — REAL FILE OBJECT
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, featuredImage: file }));

    // For preview
    setFeaturedImagePreview(URL.createObjectURL(file));
  };

  // SUBMIT
  const handleSubmit = async () => {
    const fd = new FormData();

    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("metaTitle", formData.metaTitle);
    fd.append("slug", formData.slug);
    fd.append("metaDescription", formData.metaDescription);
    fd.append("category", formData.category);
    fd.append("subcategory", formData.subcategory);
    fd.append("tags", JSON.stringify(formData.tags));
    fd.append("status", formData.status);

    // ⭐ Real file append
    if (formData.featuredImage) {
      fd.append("featuredImage", formData.featuredImage);
    }

    await createPost(fd);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Add New Blog Post</h1>
            <p className="text-sm text-gray-600">
              Manage your blog content and SEO settings
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={btnLoading}
          className={`px-5 py-2 rounded-lg text-white flex items-center gap-2 ${
            formData.status === "published"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-yellow-600 hover:bg-yellow-700"
          }`}
        >
          <Eye size={16} />
          {btnLoading
            ? "Saving..."
            : formData.status === "published"
            ? "Publish"
            : "Save Draft"}
        </button>
      </div>

      {/* MAIN FORM */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-6">
          {/* BASIC INFO */}
          <div className="bg-white rounded-lg border p-6 space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <FileText size={18} /> Basic Information
            </h2>

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((p) => ({ ...p, title: e.target.value }))
              }
              className="w-full border px-4 py-2 rounded"
              placeholder="Enter blog title"
            />

            <div>
              <label className="text-sm font-medium text-gray-600">
                Slug / URL
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, slug: e.target.value }))
                }
                className="w-full border px-4 py-2 mt-2 rounded"
              />
              <p className="text-xs text-gray-500">
                Preview: /{formData.slug || "your-slug"}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(v) =>
                  setFormData((p) => ({ ...p, description: v }))
                }
              />
            </div>
          </div>

          {/* CATEGORY & TAGS */}
          <div className="bg-white rounded-lg border p-6 space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Hash size={18} /> Category & Tags
            </h2>

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  category: e.target.value,
                  subcategory: "",
                }))
              }
              className="w-full border px-4 py-2 rounded"
            >
              <option value="">Select Category</option>
              {postCategories.map((c) => (
                <option value={c._id} key={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {availableSubcategories.length > 0 && (
              <select
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, subcategory: e.target.value }))
                }
                className="w-full border px-4 py-2 rounded"
              >
                <option value="">Select Subcategory</option>
                {availableSubcategories.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            {/* TAGS */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 border px-3 py-2 rounded"
                  placeholder="Add tag"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  <Tag size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                  >
                    #{t}
                    <button onClick={() => handleTagRemove(t)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* FEATURED IMAGE */}
          <div className="bg-white border rounded-lg p-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Img size={18} /> Featured Image
            </h3>

            {!featuredImagePreview ? (
              <label className="border-2 border-dashed rounded-md p-6 flex flex-col items-center cursor-pointer">
                <Upload size={22} className="text-gray-500 mb-2" />
                <span className="text-gray-600 text-sm">
                  Upload featured image
                </span>
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

          {/* SEO */}
          <div className="bg-white border rounded-lg p-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Globe size={18} /> SEO Settings
            </h3>

            <input
              type="text"
              placeholder="SEO Title"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData((p) => ({ ...p, metaTitle: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            />

            <textarea
              rows={4}
              placeholder="SEO Description"
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData((p) => ({ ...p, metaDescription: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* STATUS */}
          <div className="bg-white border rounded-lg p-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Eye size={18} /> Status
            </h3>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((p) => ({ ...p, status: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* FOOTER PUBLISH BUTTON */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-lg border p-6 text-right">
          <button
            onClick={handleSubmit}
            disabled={btnLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 ml-auto"
          >
            <Save size={18} />
            {btnLoading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
