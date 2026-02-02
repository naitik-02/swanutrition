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
  RotateCcw,
  FileText,
  Bookmark,
} from "lucide-react";
import { usePostCategoryContext } from "@/context/postCategory";
import { usePostSubCategoryContext } from "@/context/postSubCategory";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const PostCategoryManagement = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategorySlug, setSubcategorySlug] = useState("");
  const [subcategoryDescription, setSubcategoryDescription] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editType, setEditType] = useState("");

  const {
    postCategories,
    createPostCategory,
    updatePostCategory,
    deletePostCategory,
    fetchPostCategories,
    btnLoading: categoryBtnLoading,
    loading: categoryLoading,
  } = usePostCategoryContext();

  const {
    postSubcategories,
    createPostSubCategory,
    updatePostSubCategory,
    deletePostSubCategory,
    btnLoading: subcategoryBtnLoading,
    loading: subcategoryLoading,
    fetchPostSubCategories,
  } = usePostSubCategoryContext();

  useEffect(() => {
    fetchPostCategories();
    fetchPostSubCategories();
  },[]);

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategorySlug("");
    setCategoryDescription("");
    setEditingCategory(null);
    setIsEditMode(false);
    setEditType("");
  };

  const resetSubcategoryForm = () => {
    setSubcategoryName("");
    setSubcategorySlug("");
    setSubcategoryDescription("");
    setSelectedParentCategory("");
    setEditingSubcategory(null);
    setIsEditMode(false);
    setEditType("");
  };

  const addOrUpdateCategory = async () => {
    if (!categoryName.trim() || !categorySlug.trim()) {
      alert("Please enter category name and slug");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryName.trim());
      formData.append("slug", categorySlug.trim());
      formData.append("description", categoryDescription.trim());

      if (isEditMode && editType === "category" && editingCategory) {
        await updatePostCategory(editingCategory._id, formData);
        alert("Post category updated successfully!");
      } else {
        await createPostCategory(formData);
        alert("Post category created successfully!");
      }

      resetCategoryForm();
    } catch (error) {
      console.error("Error with post category operation:", error);
      alert(
        `Failed to ${
          isEditMode ? "update" : "create"
        } post category. Please try again.`
      );
    }
  };

  const addOrUpdateSubcategory = async () => {
    if (!selectedParentCategory) {
      alert("Please select a parent category");
      return;
    }

    if (!subcategoryName.trim() || !subcategorySlug.trim()) {
      alert("Please enter subcategory name and slug");
      return;
    }

    try {
      const payload = {
        name: subcategoryName.trim(),
        slug: subcategorySlug.trim(),
        description: subcategoryDescription.trim(),
        parentCategory: selectedParentCategory,
      };

      if (isEditMode && editType === "subcategory" && editingSubcategory) {
        await updatePostSubCategory(editingSubcategory._id, payload);
        alert("Post subcategory updated successfully!");
      } else {
        await createPostSubCategory(payload);
        alert("Post subcategory created successfully!");
      }

      resetSubcategoryForm();
    } catch (error) {
      console.error("Error with post subcategory operation:", error);
      alert(
        `Failed to ${
          isEditMode ? "update" : "create"
        } post subcategory. Please try again.`
      );
    }
  };

  const deleteCategoryHandler = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post category? This will also delete all its subcategories."
      )
    ) {
      try {
        await deletePostCategory(id);
      } catch (error) {
        console.error("Error deleting post category:", error);
        alert("Failed to delete post category. Please try again.");
      }
    }
  };

  const deleteSubcategoryHandler = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this post subcategory?")
    ) {
      try {
        await deletePostSubCategory(id);
      } catch (error) {
        console.error("Error deleting post subcategory:", error);
        alert("Failed to delete post subcategory. Please try again.");
      }
    }
  };

  const startEditingCategory = (category) => {
    setIsEditMode(true);
    setEditType("category");
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategorySlug(category.slug);
    setCategoryDescription(category.description || "");
  };

  const startEditingSubcategory = (subcategory) => {
    setIsEditMode(true);
    setEditType("subcategory");
    setEditingSubcategory(subcategory);
    setSubcategoryName(subcategory.name);
    setSubcategorySlug(subcategory.slug);
    setSubcategoryDescription(subcategory.description || "");
    setSelectedParentCategory(subcategory.parentCategory._id);
  };

  const filteredCategories =
    postCategories?.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        postSubcategories?.some(
          (sub) =>
            sub.parentCategory._id === category._id &&
            sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) || [];

  const totalSubcategoriesCount = postSubcategories?.length || 0;

  if (categoryLoading || subcategoryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Post Category Management
              </h1>
              <p className="text-gray-600">
                Create and manage blog post categories and subcategories
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Add/Edit Category */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FolderPlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {isEditMode && editType === "category"
                        ? "Edit Post Category"
                        : "Add New Post Category"}
                    </h2>
                  </div>
                  {isEditMode && editType === "category" && (
                    <button
                      onClick={resetCategoryForm}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Enter category slug"
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Description
                  </label>
                  <ReactQuill
                                theme="snow"
                                value={categoryDescription}
                    onChange={(content) => {
                     
                      setCategoryDescription(content);
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
              className="min-h-[200px]"
                  />
                </div>

                <button
                  onClick={addOrUpdateCategory}
                  disabled={categoryBtnLoading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {categoryBtnLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {categoryBtnLoading
                    ? isEditMode && editType === "category"
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode && editType === "category"
                    ? "Update Category"
                    : "Add Category"}
                </button>
              </div>
            </div>

            {/* Add/Edit Subcategory */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Tag className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {isEditMode && editType === "subcategory"
                        ? "Edit Post Subcategory"
                        : "Add New Post Subcategory"}
                    </h2>
                  </div>
                  {isEditMode && editType === "subcategory" && (
                    <button
                      onClick={resetSubcategoryForm}
                      className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <select
                    value={selectedParentCategory}
                    onChange={(e) => setSelectedParentCategory(e.target.value)}
                    className="w-full border-2 border-gray-200 py-3 px-4 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="">Select parent category</option>
                    {postCategories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Enter subcategory name"
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Enter subcategory slug"
                    value={subcategorySlug}
                    onChange={(e) => setSubcategorySlug(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Description
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

                <button
                  onClick={addOrUpdateSubcategory}
                  disabled={!selectedParentCategory || subcategoryBtnLoading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {subcategoryBtnLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {subcategoryBtnLoading
                    ? isEditMode && editType === "subcategory"
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode && editType === "subcategory"
                    ? "Update Subcategory"
                    : "Add Subcategory"}
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {postCategories?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Total Categories</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {totalSubcategoriesCount}
                </div>
                <div className="text-sm text-gray-600">Total Subcategories</div>
              </div>
            </div>
          </div>

          {/* Right Column - Categories List */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <List className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Post Categories & Subcategories
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search post categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                {/* Categories List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredCategories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm
                        ? "No post categories found matching your search"
                        : "No post categories available"}
                    </div>
                  ) : (
                    filteredCategories.map((category) => (
                      <div
                        key={category._id}
                        className="border border-gray-400 rounded-lg overflow-hidden"
                      >
                        {/* Category Header */}
                        <div className="bg-gray-50 p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900">
                                {category.name}
                              </span>
                              <div className="text-xs text-gray-500">
                                {category.slug}
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {postSubcategories?.filter(
                                (sub) => sub.parentCategory._id === category._id
                              ).length || 0}{" "}
                              subcategories
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
                              onClick={() =>
                                deleteCategoryHandler(category._id)
                              }
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Category Description */}
                        {category.description && (
                          <div className="px-4 py-2 bg-gray-25 border-b border-gray-100">
                            <div
                              className="text-sm text-gray-600 line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: category.description,
                              }}
                            />
                          </div>
                        )}

                        {/* Subcategories */}
                        {postSubcategories?.filter(
                          (sub) => sub.parentCategory._id === category._id
                        ).length > 0 && (
                          <div className="p-4 space-y-2">
                            {postSubcategories
                              .filter(
                                (sub) => sub.parentCategory._id === category._id
                              )
                              .map((subcategory) => (
                                <div
                                  key={subcategory._id}
                                  className="flex items-center justify-between py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                                      <Bookmark className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">
                                        {subcategory.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {subcategory.slug}
                                      </div>
                                      {subcategory.description && (
                                        <div
                                          className="text-xs text-gray-600 mt-1 line-clamp-1"
                                          dangerouslySetInnerHTML={{
                                            __html: subcategory.description,
                                          }}
                                        />
                                      )}
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
                                        deleteSubcategoryHandler(
                                          subcategory._id
                                        )
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
    </div>
  );
};

export default PostCategoryManagement;
