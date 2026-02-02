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
  Monitor,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useHeroSliderContext } from "@/context/heroslider";
import { useCategoryContext } from "@/context/category";
import Loading from "@/components/loading";

const HeroCategorySliderPage = () => {
  const {
    heroSliders,
    createHeroSlider,
    updateHeroSlider,
    deleteHeroSlider,
    loading,
    btnLoading,
  } = useHeroSliderContext();

  const { categories } = useCategoryContext();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState("");
  const [discount, setDiscount] = useState("");
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSlider, setEditingSlider] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImagePreview(e.target.result);
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

      setBackgroundImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setBackgroundImage(null);
    setBackgroundImagePreview("");
    const fileInput = document.getElementById("hero-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("url", url.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("discount", discount.trim());
    formData.append("order", order);
    formData.append("status", status);

    if (backgroundImage) {
      formData.append("backgroundImage", backgroundImage);
    }

    return formData;
  };

  const addHeroSlider = async () => {
   

   

    if (!url) {
      alert("Please Fill Url");
      return;
    }

    if (!backgroundImage && !backgroundImagePreview) {
      alert("Please upload a background image");
      return;
    }

    const formData = createFormData();
    await createHeroSlider(formData);
    resetForm();
  };

  // Start editing hero slider
  const startEditingSlider = (slider) => {
    setEditingSlider(slider);
    setTitle(slider.title);
    setUrl(slider.url);
    setDescription(slider.description);
    setCategory(slider.category?._id || slider.category);
    setBackgroundImagePreview(slider.backgroundImage || "");
    setDiscount(slider.discount || "");
    setOrder(slider.order || 0);
    setStatus(slider.status);
    setBackgroundImage(null);
  };

  const saveEditingSlider = async () => {
   

  

    if (!url) {
      alert("Please Fill a Url");
      return;
    }

    const formData = createFormData();
    await updateHeroSlider(editingSlider._id, formData);
    resetForm();
  };

  // Cancel editing
  const cancelEditing = () => {
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setEditingSlider(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setCategory("");
    setBackgroundImage(null);
    setBackgroundImagePreview("");
    setDiscount("");
    setOrder(0);
    setStatus("active");
    const fileInput = document.getElementById("hero-image-upload");
    if (fileInput) fileInput.value = "";
  };

  // Delete hero slider using context
  const deleteSliderHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this hero slider?")) {
      await deleteHeroSlider(id);
    }
  };

  const filteredSliders = heroSliders.filter(
    (slider) =>
      slider.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slider.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slider.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slider.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSliders = filteredSliders.sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  if (loading) {
    return (
   <Loading/>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hero Category Slider Management
              </h1>
              <p className="text-gray-600">
                Create and manage hero section sliders
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Monitor className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingSlider ? "Edit Hero Slider" : "Add New Hero Slider"}
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
                    placeholder="Enter slider title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter slider url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={(content) => {
                      
                      setDescription(content);
                    }}
                    modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      ["link", "image"],
                      [{ list: "ordered" }],
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image *
                  </label>
                  {!backgroundImagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          editingSlider
                            ? handleImageUploadEdit
                            : handleImageUpload
                        }
                        className="hidden"
                        id="hero-image-upload"
                      />
                      <label
                        htmlFor="hero-image-upload"
                        className="cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload background image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={backgroundImagePreview}
                        alt="Background preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 50% OFF, SALE, etc."
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={editingSlider ? saveEditingSlider : addHeroSlider}
                    disabled={btnLoading}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {btnLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : editingSlider ? (
                      <Save className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {btnLoading
                      ? "Saving..."
                      : editingSlider
                      ? "Update Slider"
                      : "Add Slider"}
                  </button>

                  {editingSlider && (
                    <button
                      onClick={cancelEditing}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
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

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {heroSliders.length}
              </div>
              <div className="text-sm text-gray-600">Total Hero Sliders</div>
              <div className="mt-4 flex justify-center gap-4 text-sm">
                <div className="text-green-600">
                  <span className="font-semibold">
                    {heroSliders.filter((s) => s.status === "active").length}
                  </span>{" "}
                  Active
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold">
                    {heroSliders.filter((s) => s.status === "inactive").length}
                  </span>{" "}
                  Inactive
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <List className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Hero Sliders
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search sliders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sortedSliders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm
                        ? "No sliders found matching your search"
                        : "No hero sliders available"}
                    </div>
                  ) : (
                    sortedSliders.map((slider, index) => (
                      <div
                        key={slider._id}
                        className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
                          slider.status === "inactive" ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Slider Image */}
                          <div className="flex-shrink-0">
                            {slider.backgroundImage ? (
                              <img
                                src={slider.backgroundImage}
                                alt={slider.title}
                                className="w-20 h-16 rounded-lg object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-20 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Image className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {slider.title}
                                </h3>
                                <p className="text-sm text-blue-600 mb-1">
                                  {slider.category?.name || "No Category"}
                                </p>
                                {/* {slider.discount && (
                                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-2">
                                    {slider.discount}
                                  </span>
                                )} */}
                                {slider.description && (
                                  <p
                                    className="text-sm text-gray-600 max-h-10 overflow-hidden"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        slider.description.length > 100
                                          ? slider.description.substring(
                                              0,
                                              100
                                            ) + "..."
                                          : slider.description,
                                    }}
                                  ></p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  {/* <span className="text-xs text-gray-500">
                                    Order: {slider.order || 0}
                                  </span> */}
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      slider.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {slider.status}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 ml-4">
                                <button
                                  onClick={() => startEditingSlider(slider)}
                                  className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                  title="Edit Slider"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteSliderHandler(slider._id)
                                  }
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                  title="Delete Slider"
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
    </div>
  );
};

export default HeroCategorySliderPage;
