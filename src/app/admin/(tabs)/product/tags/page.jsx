"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, List, Search, Save, X, Tag } from "lucide-react";
import { useTagContext } from "@/context/productTag";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Page = () => {
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [tagDescription, setTagDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTag, setEditingTag] = useState(null);

  const { tags, createTag, updateTag, deleteTag, btnLoading, loading } =
    useTagContext();

  console.log("Tags:", tags);

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
    setTagName(name);
    if (!editingTag) {
      setTagSlug(generateSlug(name));
    }
  };

  // Add tag
  const addTag = async () => {
    if (!tagName.trim()) {
      alert("Please enter a tag name");
      return;
    }

    if (!tagSlug.trim()) {
      alert("Please enter a tag slug");
      return;
    }

    try {
      const tagData = {
        name: tagName.trim(),
        slug: tagSlug.trim(),
        description: tagDescription.trim(),
      };

      await createTag(tagData);

      setTagName("");
      setTagSlug("");
      setTagDescription("");
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Failed to create tag. Please try again.");
    }
  };

  // Start editing tag
  const startEditingTag = (tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagSlug(tag.slug);
    setTagDescription(tag.description || "");
  };

  // Save editing tag
  const saveEditingTag = async () => {
    if (!tagName.trim()) {
      alert("Tag name cannot be empty");
      return;
    }

    if (!tagSlug.trim()) {
      alert("Tag slug cannot be empty");
      return;
    }

    try {
      const tagData = {
        name: tagName.trim(),
        slug: tagSlug.trim(),
        description: tagDescription.trim(),
      };

      await updateTag(editingTag._id, tagData);

      setEditingTag(null);
      setTagName("");
      setTagSlug("");
      setTagDescription("");
    } catch (error) {
      console.error("Error updating tag:", error);
      alert("Failed to update tag. Please try again.");
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTag(null);
    setTagName("");
    setTagSlug("");
    setTagDescription("");
  };

  // Delete tag handler
  const deleteTagHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        await deleteTag(id);
      } catch (error) {
        console.error("Error deleting tag:", error);
        alert("Failed to delete tag. Please try again.");
      }
    }
  };

  // Filter tags based on search
  const filteredTags =
    tags?.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tags...</p>
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
              Tag Management
            </h1>
            <p className="text-gray-600">Create and manage product tags</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-8">
          {/* Add/Edit Tag Form */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  {editingTag ? "Edit Tag" : "Add New Tag"}
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Tag Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter tag name"
                  value={tagName}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tag Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Slug *
                </label>
                <input
                  type="text"
                  placeholder="tag-slug"
                  value={tagSlug}
                  onChange={(e) => setTagSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly version of the name
                </p>
              </div>

              {/* Tag Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={tagDescription}
                  onChange={(content) => {
                    setTagDescription(content);
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
                    "bullet",
                    "link",
                    "image",
                  ]}
                  className="min-h-[200px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={editingTag ? saveEditingTag : addTag}
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
                      {editingTag ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {editingTag ? "Update Tag" : "Add Tag"}
                    </div>
                  )}
                </button>

                {editingTag && (
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
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-gray-600 mb-2">
              {tags?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Total Tags</div>
          </div>
        </div>

        {/* Right Column - Tag List */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">All Tags</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tags List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredTags.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? "No tags found matching your search"
                      : "No tags available"}
                  </div>
                ) : (
                  filteredTags.map((tag) => (
                    <div
                      key={tag._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {/* Tag Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
                            <Tag className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>

                        {/* Tag Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm">
                                {tag.name}
                              </h3>

                              {tag.description && (
                                <div
                                  className="text-sm text-gray-600 max-h-10 overflow-hidden line-clamp-2"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      tag.description.length > 100
                                        ? tag.description.substring(0, 100) +
                                          "..."
                                        : tag.description,
                                  }}
                                />
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => startEditingTag(tag)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                title="Edit Tag"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteTagHandler(tag._id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                title="Delete Tag"
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
