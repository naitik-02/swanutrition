"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  Tag,
  List,
  Search,
  X,
  Upload,
  Image,
  RotateCcw,
  Palette,
  Circle,
  Type,
  MousePointer,
  ChevronDown,
} from "lucide-react";
import { useAttributeContext } from "@/context/attribute";

const AttributeManagement = () => {
  const {
    attributes,
    attributeTerms,
    btnLoading,
    loading,
    createAttribute,
    updateAttribute,
    deleteAttribute,
    createAttributeTerm,
    updateAttributeTerm,
    deleteAttributeTerm,
    generateSlug,
    fetchAttributeTerms,

    fetchAttributes,
    getTermsByAttributeId,
    getAttributeTypes,
  } = useAttributeContext()

  const [attributeName, setAttributeName] = useState("");
  const [attributeType, setAttributeType] = useState("select");
  const [attributeSortOrder, setAttributeSortOrder] = useState("name");
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [termName, setTermName] = useState("");
  const [termColorCode, setTermColorCode] = useState("#000000");
  const [termImage, setTermImage] = useState(null);
  const [termImagePreview, setTermImagePreview] = useState("");
  const [editingTerm, setEditingTerm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editType, setEditType] = useState("");

  const attributeTypes = getAttributeTypes();



    useEffect(() => {
    fetchAttributes();
    fetchAttributeTerms();
  }, []);


  const resetAttributeForm = () => {
    setAttributeName("");
    setAttributeType("select");
    setAttributeSortOrder("name");
    setEditingAttribute(null);
    setIsEditMode(false);
    setEditType("");
  };

  const resetTermForm = () => {
    setSelectedAttribute("");
    setTermName("");
    setTermColorCode("#000000");
    setTermImage(null);
    setTermImagePreview("");
    setEditingTerm(null);
    setIsEditMode(false);
    setEditType("");
    const fileInput = document.getElementById("term-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleTermImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setTermImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setTermImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTermImage = () => {
    setTermImage(null);
    setTermImagePreview("");
    const fileInput = document.getElementById("term-image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleAddOrUpdateAttribute = async () => {
    if (!attributeName.trim()) {
      alert("Please enter an attribute name");
      return;
    }

    const formData = new FormData();
    formData.append("name", attributeName.trim());
    formData.append("slug", generateSlug(attributeName.trim()));
    formData.append("type", attributeType);
    formData.append("sortOrder", attributeSortOrder);

    if (isEditMode && editType === "attribute" && editingAttribute) {
      await updateAttribute(editingAttribute._id, formData);
    } else {
      await createAttribute(formData);
    }
    resetAttributeForm();
  };

  const handleAddOrUpdateTerm = async () => {
    if (!selectedAttribute) {
      alert("Please select an attribute");
      return;
    }
    if (!termName.trim()) {
      alert("Please enter a term name");
      return;
    }

    const formData = new FormData();
    formData.append("attribute", selectedAttribute);
    formData.append("name", termName.trim());
    formData.append("slug", generateSlug(termName.trim()));

    if (selectedAttributeType === "color") {
      formData.append("colorCode", termColorCode);
    }

    if (termImage) {
      formData.append("image", termImage);
    }

    if (isEditMode && editType === "term" && editingTerm) {
      await updateAttributeTerm(editingTerm._id, formData);
    } else {
      await createAttributeTerm(formData);
    }
    resetTermForm();
  };

  const handleDeleteAttribute = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this attribute? This will also delete all its terms."
      )
    ) {
      await deleteAttribute(id);
    }
  };

  const handleDeleteTerm = async (id) => {
    if (window.confirm("Are you sure you want to delete this term?")) {
      await deleteAttributeTerm(id);
    }
  };

  const startEditingAttribute = (attribute) => {
    setIsEditMode(true);
    setEditType("attribute");
    setEditingAttribute(attribute);
    setAttributeName(attribute.name);
    setAttributeType(attribute.type);
    setAttributeSortOrder(attribute.sortOrder);
  };

  const startEditingTerm = (term) => {
    setIsEditMode(true);
    setEditType("term");
    setEditingTerm(term);
    setSelectedAttribute(term.attribute._id);
    setTermName(term.name);
    setTermColorCode(term.colorCode || "#000000");
    if (term.image) {
      setTermImagePreview(term.image);
    }
  };

  const filteredAttributes = attributes.filter(
    (attribute) =>
      attribute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTermsByAttributeId(attribute._id).some((term) =>
        term.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getAttributeIcon = (type) => {
    const typeConfig = attributeTypes.find((t) => t.value === type);
    if (typeConfig) {
      switch (type) {
        case "color":
          return <Palette className="w-4 h-4" />;
        case "radio":
          return <Circle className="w-4 h-4" />;
        case "image":
          return <Image className="w-4 h-4" />;
        case "button":
          return <MousePointer className="w-4 h-4" />;
        case "select":
          return <ChevronDown className="w-4 h-4" />;
        default:
          return <Type className="w-4 h-4" />;
      }
    }
    return <Type className="w-4 h-4" />;
  };

  const getAttributeTypeLabel = (type) => {
    const typeConfig = attributeTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.label : type;
  };

  const selectedAttributeType =
    attributes.find((attr) => attr._id === selectedAttribute)?.type || "select";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Attribute Management
              </h1>
              <p className="text-gray-600 text-sm">
                Create and manage product attributes and terms
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-5">
            {/* Add/Edit Attribute */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Settings className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {isEditMode && editType === "attribute"
                        ? "Edit Attribute"
                        : "Add New Attribute"}
                    </h2>
                  </div>
                  {isEditMode && editType === "attribute" && (
                    <button
                      onClick={resetAttributeForm}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Enter attribute name"
                    value={attributeName}
                    onChange={(e) => setAttributeName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Attribute Type
                  </label>
                  <select
                    value={attributeType}
                    onChange={(e) => setAttributeType(e.target.value)}
                    className="w-full border border-gray-200 py-2 px-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                  >
                    {attributeTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <select
                    value={attributeSortOrder}
                    onChange={(e) => setAttributeSortOrder(e.target.value)}
                    className="w-full border border-gray-200 py-2 px-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                  >
                    <option value="name">Name</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <button
                  onClick={handleAddOrUpdateAttribute}
                  disabled={btnLoading}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {btnLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                  {btnLoading
                    ? isEditMode && editType === "attribute"
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode && editType === "attribute"
                    ? "Update Attribute"
                    : "Add Attribute"}
                </button>
              </div>
            </div>

            {/* Add/Edit Term */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-50 rounded-lg">
                      <Tag className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {isEditMode && editType === "term"
                        ? "Edit Term"
                        : "Add New Term"}
                    </h2>
                  </div>
                  {isEditMode && editType === "term" && (
                    <button
                      onClick={resetTermForm}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <select
                    value={selectedAttribute}
                    onChange={(e) => setSelectedAttribute(e.target.value)}
                    className="w-full border border-gray-200 py-2 px-3 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  >
                    <option value="">Select attribute</option>
                    {attributes.map((attr) => (
                      <option key={attr._id} value={attr._id}>
                        {attr.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter term name"
                    value={termName}
                    onChange={(e) => setTermName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-100"
                  />
                </div>

                {/* Color picker for color attributes */}
                {selectedAttributeType === "color" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Color Code
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={termColorCode}
                        onChange={(e) => setTermColorCode(e.target.value)}
                        className="h-8 w-12 border border-gray-200 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={termColorCode}
                        onChange={(e) => setTermColorCode(e.target.value)}
                        className="flex-1 border border-gray-200 py-1 px-2 rounded text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Image upload for image attributes */}
                {selectedAttributeType === "image" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Term Image
                    </label>
                    {!termImagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-green-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleTermImageUpload}
                          className="hidden"
                          id="term-image-upload"
                        />
                        <label
                          htmlFor="term-image-upload"
                          className="cursor-pointer"
                        >
                          <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">
                            Click to upload
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={termImagePreview}
                          alt="Term preview"
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={removeTermImage}
                          className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleAddOrUpdateTerm}
                  disabled={!selectedAttribute || btnLoading}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {btnLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                  {btnLoading
                    ? isEditMode && editType === "term"
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode && editType === "term"
                    ? "Update Term"
                    : "Add Term"}
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {attributes.length}
                </div>
                <div className="text-xs text-gray-600">Total Attributes</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {attributeTerms.length}
                </div>
                <div className="text-xs text-gray-600">Total Terms</div>
              </div>
            </div>
          </div>

          {/* Right Column - Attributes List */}
          <div className="space-y-5">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <List className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">
                    All Attributes & Terms
                  </h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input
                    type="text"
                    placeholder="Search attributes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                  />
                </div>

                {/* Attributes List */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading...</p>
                    </div>
                  ) : filteredAttributes.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      {searchTerm
                        ? "No attributes found matching your search"
                        : "No attributes available"}
                    </div>
                  ) : (
                    filteredAttributes.map((attribute) => (
                      <div
                        key={attribute._id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Attribute Header */}
                        <div className="bg-gray-50 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-white rounded border">
                              {getAttributeIcon(attribute.type)}
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 text-sm">
                                {attribute.name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                  {getAttributeTypeLabel(attribute.type)}
                                </span>
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                  {getTermsByAttributeId(attribute._id).length}{" "}
                                  terms
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEditingAttribute(attribute)}
                              className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteAttribute(attribute._id)
                              }
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Terms */}
                        {getTermsByAttributeId(attribute._id).length > 0 && (
                          <div className="p-3 space-y-2">
                            {getTermsByAttributeId(attribute._id).map(
                              (term) => (
                                <div
                                  key={term._id}
                                  className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                   
                                    {attribute.type === "color" &&
                                      term.colorCode && (
                                        <div
                                          className="w-4 h-4 rounded border border-gray-300"
                                          style={{
                                            backgroundColor: term.colorCode,
                                          }}
                                        ></div>
                                      )}
                                    {attribute.type === "image" &&
                                      term.image && (
                                        <img
                                          src={term.image}
                                          alt={term.name}
                                          className="w-6 h-6 rounded object-cover border border-gray-200"
                                        />
                                      )}
                                    <div>
                                      <div className="font-medium text-gray-900 text-sm">
                                        {term.name}
                                      </div>
                                      {term.colorCode && (
                                        <div className="text-xs text-gray-500">
                                          {term.colorCode}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => startEditingTerm(term)}
                                      className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTerm(term._id)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              )
                            )}
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

export default AttributeManagement;
