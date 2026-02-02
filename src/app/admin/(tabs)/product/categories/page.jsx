"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FolderPlus,
  Tag,
  List,
  Search,
  X,
  Upload,
  Image,
  RotateCcw,
} from "lucide-react";
import { useCategoryContext } from "@/context/category";
import { useSubcategoryContext } from "@/context/subcategory";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

const CategoryManagement = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategorySlug, setSubcategorySlug] = useState("");
  const [subcategoryDescription, setSubcategoryDescription] = useState("");
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [subcategoryImagePreview, setSubcategoryImagePreview] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editType, setEditType] = useState("");

  const {
    categories,
    createCategory,
    DeleteCategory,
    UpdateCategory,
    btnLoading: categoryBtnLoading,
    loading: categoryLoading,
  } = useCategoryContext();


    useEffect(() => {
      if (categoryName) {
        const generatedSlug = categoryName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
  
        setCategorySlug(generatedSlug);
      }
    }, [categoryName]);


    useEffect(() => {
      if (subcategoryName) {
        const generatedSlug = subcategoryName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
  
        setSubcategorySlug(generatedSlug);
      }
    }, [subcategoryName]);

  const {
    subcategories,
    UpdateSubcategory,
    createSubcategory,
    deleteSubcategory,
    btnLoading: subcategoryBtnLoading,
    loading: subcategoryLoading,
  } = useSubcategoryContext();

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategorySlug("");
    setCategoryImage(null);
    setCategoryImagePreview("");
    setEditingCategory(null);
    setIsEditMode(false);
    setEditType("");

    const fileInput = document.getElementById("category-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const resetSubcategoryForm = () => {
    setSubcategoryName("");
    setSubcategorySlug("");

    setSubcategoryDescription("");
    setSubcategoryImage(null);
    setSubcategoryImagePreview("");
    setSelectedParentCategory("");
    setEditingSubcategory(null);
    setIsEditMode(false);
    setEditType("");

    const fileInput = document.getElementById("subcategory-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSubcategoryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setSubcategoryImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSubcategoryImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSubcategoryImage = () => {
    setSubcategoryImage(null);
    setSubcategoryImagePreview("");

    const fileInput = document.getElementById("subcategory-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setCategoryImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCategoryImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCategoryImage(null);
    setCategoryImagePreview("");

    const fileInput = document.getElementById("category-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const addOrUpdateCategory = async () => {
    if (!categoryName.trim() || !categorySlug.trim()) {
      alert("Please enter all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryName.trim());
      formData.append("slug", categorySlug.trim());
      if (categoryImage) {
        formData.append("image", categoryImage);
      }

      if (isEditMode && editType === "category" && editingCategory) {
        await UpdateCategory(editingCategory._id, formData);
        alert("Category updated successfully!");
      } else {
        console.log(formData);
        await createCategory(formData);

        alert("Category created successfully!");
      }

      resetCategoryForm();
    } catch (error) {
      console.error("Error with category operation:", error);
      alert(
        `Failed to ${
          isEditMode ? "update" : "create"
        } category. Please try again.`
      );
    }
  };

  const addOrUpdateSubcategory = async () => {
    if (!selectedParentCategory) {
      alert("Please select a parent category");
      return;
    }

    if (!subcategoryName.trim()) {
      alert("Please enter a subcategory name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", subcategoryName.trim());
      formData.append("slug", subcategorySlug.trim());
      formData.append("description", subcategoryDescription.trim());
      formData.append("category", selectedParentCategory);
      if (subcategoryImage) {
        formData.append("image", subcategoryImage);
      }

      if (isEditMode && editType === "subcategory" && editingSubcategory) {
        await UpdateSubcategory(editingSubcategory._id, formData);
        alert("Subcategory updated successfully!");
      } else {
        await createSubcategory(formData);
        alert("Subcategory created successfully!");
      }

      resetSubcategoryForm();
    } catch (error) {
      console.error("Error with subcategory operation:", error);
      alert(
        `Failed to ${
          isEditMode ? "update" : "create"
        } subcategory. Please try again.`
      );
    }
  };

  const deleteCategoryHandler = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This will also delete all its subcategories."
      )
    ) {
      try {
        await DeleteCategory(id);
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const deleteSubcategoryHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await deleteSubcategory(id);
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        alert("Failed to delete subcategory. Please try again.");
      }
    }
  };

  const startEditingCategory = (category) => {
    setIsEditMode(true);
    setEditType("category");
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    if (category.image) {
      setCategoryImagePreview(category.image);
    }
  };

  const startEditingSubcategory = (subcategory) => {
    setIsEditMode(true);
    setEditType("subcategory");
    setEditingSubcategory(subcategory);
    setSubcategoryName(subcategory.name);
    setSubcategorySlug(subcategory.slug);
    setSubcategoryDescription(subcategory.description || "");
    setSelectedParentCategory(subcategory.category._id);
    if (subcategory.image) {
      setSubcategoryImagePreview(subcategory.image);
    }
  };

  const filteredCategories =
    categories?.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subcategories?.some(
          (sub) =>
            sub.category._id === category._id &&
            sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) || [];

  const totalSubcategoriesCount = subcategories?.length || 0;

  if (categoryLoading || subcategoryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Category Management
            </h1>
            <p className="text-gray-600">
              Create and manage product categories and subcategories
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Add/Edit Category */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderPlus className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">
                    {isEditMode && editType === "category"
                      ? "Edit Category"
                      : "Add New Category"}
                  </h2>
                </div>
                {isEditMode && editType === "category" && (
                  <button
                    onClick={resetCategoryForm}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Slug *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter category slug"
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                {!categoryImagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-3 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="category-image-upload"
                    />
                    <label
                      htmlFor="category-image-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <div className="p-2 bg-gray-100 rounded-full mb-2">
                          <Upload className="w-4 h-4 text-gray-600" />
                        </div>
                        <p className="text-gray-600 text-sm mb-0.5">
                          Upload category image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative w-32 h-24">
                    <img
                      src={categoryImagePreview}
                      alt="Category preview"
                      className="w-full h-full object-cover rounded-md border border-gray-300"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={addOrUpdateCategory}
                disabled={categoryBtnLoading}
                className={`w-full py-3 rounded-md font-medium transition-colors ${
                  categoryBtnLoading
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {categoryBtnLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEditMode && editType === "category"
                      ? "Updating..."
                      : "Adding..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    {isEditMode && editType === "category"
                      ? "Update Category"
                      : "Add Category"}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Add/Edit Subcategory */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">
                    {isEditMode && editType === "subcategory"
                      ? "Edit Subcategory"
                      : "Add New Subcategory"}
                  </h2>
                </div>
                {isEditMode && editType === "subcategory" && (
                  <button
                    onClick={resetSubcategoryForm}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category *
                </label>
                <select
                  value={selectedParentCategory}
                  onChange={(e) => setSelectedParentCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select parent category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subcategory name"
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Slug *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subcategory slug"
                    value={subcategorySlug}
                    onChange={(e) => setSubcategorySlug(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={subcategoryDescription}
                  onChange={(content) => {
                    setSubcategoryDescription(content);
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

              {/* Subcategory Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Image
                </label>
                {!subcategoryImagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-3 text-center hover:border-green-400 hover:bg-green-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSubcategoryImageUpload}
                      className="hidden"
                      id="subcategory-image-upload"
                    />
                    <label
                      htmlFor="subcategory-image-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <div className="p-2 bg-gray-100 rounded-full mb-2">
                          <Upload className="w-4 h-4 text-gray-600" />
                        </div>
                        <p className="text-gray-600 text-sm mb-0.5">
                          Upload subcategory image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative w-28 h-20">
                    <img
                      src={subcategoryImagePreview}
                      alt="Subcategory preview"
                      className="w-full h-full object-cover rounded-md border border-gray-300"
                    />
                    <button
                      onClick={removeSubcategoryImage}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={addOrUpdateSubcategory}
                disabled={!selectedParentCategory || subcategoryBtnLoading}
                className={`w-full py-3 rounded-md font-medium transition-colors ${
                  !selectedParentCategory || subcategoryBtnLoading
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {subcategoryBtnLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEditMode && editType === "subcategory"
                      ? "Updating..."
                      : "Adding..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    {isEditMode && editType === "subcategory"
                      ? "Update Subcategory"
                      : "Add Subcategory"}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-600 mb-2">
                {categories?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Categories</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-600 mb-2">
                {totalSubcategoriesCount}
              </div>
              <div className="text-sm text-gray-600">Total Subcategories</div>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  All Categories & Subcategories
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Categories List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? "No categories found matching your search"
                      : "No categories available"}
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <div
                      key={category._id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Category Header */}
                      <div className="bg-gray-50 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-10 h-10 rounded-md object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                              <Image className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {subcategories?.filter(
                              (sub) => sub.category._id === category._id
                            ).length || 0}{" "}
                            items
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditingCategory(category)}
                            className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCategoryHandler(category._id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      {subcategories?.filter(
                        (sub) => sub.category._id === category._id
                      ).length > 0 && (
                        <div className="p-4 space-y-2">
                          {subcategories
                            .filter((sub) => sub.category._id === category._id)
                            .map((subcategory) => (
                              <div
                                key={subcategory._id}
                                className="flex items-center justify-between py-3 px-4 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {subcategory?.image ? (
                                    <img
                                      src={subcategory.image}
                                      alt={subcategory.name}
                                      className="w-8 h-8 rounded object-cover border border-gray-200"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                      <Image className="w-4 h-4 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 text-sm">
                                      {subcategory.name}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      startEditingSubcategory(subcategory)
                                    }
                                    className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteSubcategoryHandler(subcategory._id)
                                    }
                                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
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

export default CategoryManagement;
