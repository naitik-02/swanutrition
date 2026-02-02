"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Upload, Video, FileText, Link2, Check, AlertCircle } from "lucide-react";

const AddVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    video: null,
    product: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  }, [formData.title]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("slug", formData.slug);
    data.append("product", formData.product);
    data.append("video", formData.video);
    data.append("isActive", String(formData.isActive));

    try {
      const res = await axios.post("/api/Admin/video/add", data, {
        withCredentials: true,
      });
      setSuccess(res.data.message || "Video uploaded successfully!");
      setFormData({
        title: "",
        slug: "",
        video: null,
        product: "",
        isActive: true,
      });
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESP:", error?.response?.data);
      setError(error?.response?.data?.message || error.message || "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Video className="text-blue-600" size={32} />
                Video Management
              </h1>
              <p className="text-slate-600 mt-2">Upload and manage your video content</p>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-green-900">Success</h3>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText size={16} />
                Video Title
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                type="text"
                required
                placeholder="Enter video title"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Slug Input */}
            <div>
              <label htmlFor="slug" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Link2 size={16} />
                URL Slug
              </label>
              <input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                type="text"
                required
                placeholder="auto-generated-from-title"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400 bg-slate-50"
              />
              <p className="mt-1 text-xs text-slate-500">Automatically generated from title</p>
            </div>

            {/* Product Input */}
            <div>
              <label htmlFor="product" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Check size={16} />
                Product Slug
              </label>
              <input
                id="product"
                name="product"
                type="text"
                value={formData.product}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, product: e.target.value }))
                }
                placeholder="product-slug-here"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Video Upload */}
            <div>
              <label htmlFor="video" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Upload size={16} />
                Video File
              </label>
              <div className="relative">
                <input
                  id="video"
                  name="video"
                  type="file"
                  accept="video/*"
                  required
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, video: e.target.files[0] }))
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
              {formData.video && (
                <p className="mt-2 text-sm text-slate-600">
                  Selected: <span className="font-medium">{formData.video.name}</span>
                </p>
              )}
            </div>

            {/* Active Status Toggle */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                Mark video as active
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Video
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVideo;