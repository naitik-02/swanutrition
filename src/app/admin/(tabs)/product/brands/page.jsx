"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  List,
  Search,
  Save,
  X,
  Upload,
  Image,
  Package,
} from "lucide-react";
import { useBrandContext } from "@/context/brand";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

const Page = () => {
  const [brandName, setBrandName] = useState("");
  const [brandSlug, setBrandSlug] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandImage, setBrandImage] = useState(null);
  const [brandImagePreview, setBrandImagePreview] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);

  const {
    brands,
    createBrand,
    updateBrand,
    deleteBrand,
    btnLoading,
    loading,
    fetchBrands,
  } = useBrandContext();

  useEffect(() => {
    fetchBrands();
  }, []);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setBrandName(name);
    if (!editingBrand) {
      setBrandSlug(generateSlug(name));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setBrandImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadEdit = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setBrandImage(file);
    }
  };

  const removeImage = () => {
    setBrandImage(null);
    setBrandImagePreview("");
    const fileInput = document.getElementById("brand-image-upload");
    if (fileInput) fileInput.value = "";
  };

  // Add brand
  const addBrand = async () => {
    if (!brandName.trim()) {
      alert("Please enter a brand name");
      return;
    }

    if (!brandSlug.trim()) {
      alert("Please enter a brand slug");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", brandName.trim());
      formData.append("slug", brandSlug.trim());
      formData.append("description", brandDescription.trim());
      if (brandImage) {
        formData.append("image", brandImage);
      }

      await createBrand(formData);

      setBrandName("");
      setBrandSlug("");
      setBrandDescription("");
      setBrandImage(null);
      setBrandImagePreview("");
      const fileInput = document.getElementById("brand-image-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error creating brand:", error);
      alert("Failed to create brand. Please try again.");
    }
  };

  // Start editing brand
  const startEditingBrand = (brand) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setBrandSlug(brand.slug);
    setBrandDescription(brand.description || "");
    setBrandImagePreview(brand.image || "");
    setBrandImage(null);
  };

  // Save editing brand
  const saveEditingBrand = async () => {
    if (!brandName.trim()) {
      alert("Brand name cannot be empty");
      return;
    }

    if (!brandSlug.trim()) {
      alert("Brand slug cannot be empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", brandName.trim());
      formData.append("slug", brandSlug.trim());
      formData.append("description", brandDescription.trim());

      if (brandImage) {
        formData.append("image", brandImage);
      }

      await updateBrand(editingBrand._id, formData);

      setEditingBrand(null);
      setBrandName("");
      setBrandSlug("");
      setBrandDescription("");
      setBrandImage(null);
      setBrandImagePreview("");
      const fileInput = document.getElementById("brand-image-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error updating brand:", error);
      alert("Failed to update brand. Please try again.");
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingBrand(null);
    setBrandName("");
    setBrandSlug("");
    setBrandDescription("");
    setBrandImage(null);
    setBrandImagePreview("");
    const fileInput = document.getElementById("brand-image-upload");
    if (fileInput) fileInput.value = "";
  };

  // Delete brand handler
  const deleteBrandHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteBrand(id);
      } catch (error) {
        console.error("Error deleting brand:", error);
        alert("Failed to delete brand. Please try again.");
      }
    }
  };

  // Filter brands based on search
  const filteredBrands =
    brands?.filter(
      (brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.slug.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
    
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Brand Management
            </h1>
            <p className="text-gray-600">Create and manage product brands</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-8">
          {/* Add/Edit Brand Form */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  {editingBrand ? "Edit Brand" : "Add New Brand"}
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={brandName}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Brand Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Slug *
                </label>
                <input
                  type="text"
                  placeholder="brand-slug"
                  value={brandSlug}
                  onChange={(e) => setBrandSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly version of the name
                </p>
              </div>

              {/* Brand Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={brandDescription}
                  onChange={(content) => {
                    setBrandDescription(content);
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

                    "link",
                    "image",
                  ]}
                />
              </div>

              {/* Brand Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Image
                </label>
                {!brandImagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-3 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        editingBrand ? handleImageUploadEdit : handleImageUpload
                      }
                      className="hidden"
                      id="brand-image-upload"
                    />
                    <label
                      htmlFor="brand-image-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <div className="p-3 bg-gray-100 rounded-full mb-3">
                          <Upload className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          Upload brand image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <img
                      src={brandImagePreview}
                      alt="Brand preview"
                      className="w-24 h-24 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={editingBrand ? saveEditingBrand : addBrand}
                  disabled={btnLoading}
                  className={`flex-1 py-3 rounded-md font-medium transition-colors ${
                    btnLoading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {btnLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {editingBrand ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {editingBrand ? "Update Brand" : "Add Brand"}
                    </div>
                  )}
                </button>

                {editingBrand && (
                  <button
                    onClick={cancelEditing}
                    className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
        </div>

        {/* Right Column - Brand List */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  All Brands
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Brands List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredBrands.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? "No brands found matching your search"
                      : "No brands available"}
                  </div>
                ) : (
                  filteredBrands.map((brand) => (
                    <div
                      key={brand._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {/* Brand Image */}
                        <div className="flex-shrink-0">
                          {brand.image ? (
                            <img
                              src={brand.image}
                              alt={brand.name}
                              className="w-12 h-12 rounded-md object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Brand Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm">
                                {brand.name}
                              </h3>

                              {brand.description && (
                                <div
                                  className="text-sm text-gray-600 max-h-10 overflow-hidden line-clamp-2"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      brand.description.length > 100
                                        ? brand.description.substring(0, 100) +
                                          "..."
                                        : brand.description,
                                  }}
                                />
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => startEditingBrand(brand)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                title="Edit Brand"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteBrandHandler(brand._id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                title="Delete Brand"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
