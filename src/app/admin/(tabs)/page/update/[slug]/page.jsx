"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Eye,
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  FileText,
  Layout,
  Image as ImageIcon,
  Edit,
  Copy,
  Repeat,
} from "lucide-react";
import { useParams } from "next/navigation";
import { usePageContext } from "@/context/pages";
import axios from "axios";
import AddSectionForm from "@/components/(admin)/(pages)/AddSectionForm";
import EditSectionForm from "@/components/(admin)/(pages)/EditSectionForm";
import Loading from "@/components/loading";

const EditPageSections = () => {
  const {
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    btnLoading,
    loading,
    setLoading,
  } = usePageContext();

  const { slug } = useParams();

  const [pageData, setPageData] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [draggedSection, setDraggedSection] = useState(null);

  const sectionTypeConfigs = {
    "hero-section": {
      label: "Hero Section",
      icon: Layout,
     
    },
    "image-box": {
      label: "Image Box",
      icon: ImageIcon,
      
    },
    editor: {
      label: "Text Editor",
      icon: Edit,
    
    },
    image: {
      label: "Image Only",
      icon: ImageIcon,
    
    },
  };

  const getPage = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/Admin/pages/${slug}`, {
        withCredentials: true,
      });
      setPageData(data?.data);
    } catch (error) {
      console.error(
        "Failed to fetch page:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) getPage();
  }, [slug, setLoading]);

  const handleAddSection = async (formData) => {
    try {
      await addSection(pageData._id, formData);
      getPage(); // Refresh page data
    } catch (error) {
      console.error("Error adding section:", error);
      throw error;
    }
  };

  const handleUpdateSection = async (formData) => {
    try {
      await updateSection(formData);
      getPage();
      setEditingSection(null);
    } catch (error) {
      console.error("Error updating section:", error);
      throw error;
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm("Are you sure you want to delete this section?")) {
      return;
    }

    try {
      await deleteSection(pageData._id, sectionId);
      setPageData((prev) => ({
        ...prev,
        sections: prev.sections.filter((section) => section._id !== sectionId),
      }));
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleDragStart = (e, section) => {
    setDraggedSection(section);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetSection) => {
    e.preventDefault();

    if (!draggedSection || draggedSection._id === targetSection._id) {
      return;
    }

    const sections = [...pageData.sections];
    const draggedIndex = sections.findIndex(
      (s) => s._id === draggedSection._id
    );
    const targetIndex = sections.findIndex((s) => s._id === targetSection._id);

    sections.splice(draggedIndex, 1);
    sections.splice(targetIndex, 0, draggedSection);

    const reorderedSections = sections.map((section, index) => ({
      ...section,
      order: index,
    }));

    try {
      await reorderSections(pageData._id, reorderedSections);
      setPageData((prev) => ({ ...prev, sections: reorderedSections }));
    } catch (error) {
      console.error("Error reordering sections:", error);
    }

    setDraggedSection(null);
  };

  const getSectionPreviewData = (section) => {
    const config = sectionTypeConfigs[section.type] || {};
    const fields = Array.isArray(section.fields) ? section.fields : [];

    switch (section.type) {
      case "hero-section":
        return {
          title: "Hero Section",
          preview: `${fields.length} item(s)`,
          hasImage: fields.some((f) => !!f.image),
          hasButton: fields.some((f) => f.button && f.buttonLink),
          items: fields.map((f) => ({
            heading: f.heading,
            paragraph: f.paragraph,
            button: f.button,
            buttonLink: f.buttonLink,
            image: f.image,
          })),
        };
      default:
        return {
          title:` ${section.type}`,
          preview: "Unknown section type",
          hasImage: false,
          hasButton: false,
          items: [],
        };
    }
  };

  // Loading state
  if (loading || !pageData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Edit Page: {pageData.title || pageData.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage sections for this page • /{pageData.slug}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Section
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* Add Section Form Component */}
                <AddSectionForm
                  showAddForm={showAddForm}
                  setShowAddForm={setShowAddForm}
                  onAddSection={handleAddSection}
                  btnLoading={btnLoading}
                />

                {/* Sections List */}
                <div className="rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Page Sections ({pageData.sections?.length || 0})
                    </h2>
                  </div>

                  <div className="p-6">
                    {!pageData.sections || pageData.sections.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <FileText size={48} className="mx-auto" />
                        </div>
                        <p className="text-gray-500 mb-4">No sections found</p>
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Plus size={16} />
                          Add Your First Section
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pageData.sections.map((section, index) => {
                          const config = sectionTypeConfigs[section.type] || {};
                          const previewData = getSectionPreviewData(section);
                          const IconComponent = config.icon || FileText;

                          return (
                            <div
                              key={section._id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, section)}
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, section)}
                              className={`border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow cursor-move ${
                                editingSection?._id === section._id
                                  ? "ring-2 ring-blue-500"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <GripVertical
                                    size={20}
                                    className="text-gray-400"
                                  />
                                  <div className="flex items-center gap-2">
                                    <IconComponent
                                      size={20}
                                      className={`text-${
                                        config.color || "gray"
                                      }-600`}
                                    />
                                    <div>
                                      <h3 className="text-lg font-medium text-gray-900">
                                        {previewData.title}
                                      </h3>
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs bg-${
                                            config.color || "gray"
                                          }-100 text-${
                                            config.color || "gray"
                                          }-800`}
                                        >
                                          {config.label || section.type}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setEditingSection(section)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSection(section._id)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {editingSection?._id === section._id ? (
                                <EditSectionForm
                                  editingSection={editingSection}
                                  setEditingSection={setEditingSection}
                                  onUpdateSection={handleUpdateSection}
                                  btnLoading={btnLoading}
                                  pageData={pageData}
                                />
                              ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                  {Array.isArray(section.fields) &&
                                  section.fields.length > 0 ? (
                                    // just take the keys from the first field object
                                    Object.keys(section.fields[0]).map(
                                      (fieldKey, i) => (
                                        <span
                                          key={i}
                                          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium"
                                        >
                                          {fieldKey}
                                        </span>
                                      )
                                    )
                                  ) : (
                                    <p className="text-gray-500">
                                      No fields defined
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Page Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <FileText size={16} />
                      Page Information
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Title:
                        </span>
                        <p className="text-gray-600">
                          {pageData.title || pageData.name}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">URL:</span>
                        <p className="text-gray-600">/{pageData.slug}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Sections:
                        </span>
                        <p className="text-gray-600">
                          {pageData.sections?.length || 0}
                        </p>
                      </div>
                      {pageData.metaTitle && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Meta Title:
                          </span>
                          <p className="text-gray-600">{pageData.metaTitle}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sections Overview */}
                {pageData.sections && pageData.sections.length > 0 && (
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                    <h4 className="font-medium text-blue-900 mb-3">
                      📋 Sections Overview
                    </h4>
                    <div className="space-y-2">
                      {pageData.sections
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((section, index) => {
                          const config = sectionTypeConfigs[section.type] || {};
                          const previewData = getSectionPreviewData(section);

                          return (
                            <div
                              key={section._id}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-blue-800 flex items-center gap-2">
                                {config.icon &&
                                  React.createElement(config.icon, {
                                    size: 14,
                                  })}
                                {index + 1}.{" "}
                                {previewData.title.substring(0, 20)}
                                {previewData.title.length > 20 ? "..." : ""}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setEditingSection(section)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSection(section._id)
                                  }
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Section Types Legend */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    🎨 Available Section Types
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(sectionTypeConfigs).map(
                      ([type, config]) => {
                        const IconComponent = config.icon;
                        return (
                          <div
                            key={type}
                            className="flex items-center gap-2 text-sm"
                          >
                            <IconComponent
                              size={14}
                              className={`text-${config.color}-600`}
                            />
                            <span className="text-gray-700">
                              {config.label}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPageSections;
