"use client";
import React, { useState, useRef } from "react";
import {
  Plus,
  Upload,
  X,
  Layout,
  Image as ImageIcon,
  Edit,
  Copy,
} from "lucide-react";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

const AddSectionForm = ({
  showAddForm,
  setShowAddForm,
  onAddSection,
  btnLoading,
}) => {
  const [selectedType, setSelectedType] = useState("");
  const [sectionInstances, setSectionInstances] = useState([{}]); 
  const [uploadedImages, setUploadedImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const fileInputRefs = useRef({});

  // ✅ Config of all section types
  const sectionTypes = {
    "hero-section": {
      label: "Hero Section",
      icon: Layout,
      fields: {
        heading: { type: "text", label: "Heading", required: true },
        paragraph: { type: "text", label: "Paragraph" },
        button: { type: "text", label: "Button Text" },
        buttonLink: { type: "text", label: "Button Link" },
        image: { type: "image", label: "Hero Image" },
      },
    },
    "image-box": {
      label: "Image Box",
      icon: ImageIcon,
      fields: {
        title: { type: "text", label: "Title", required: true },
        image: { type: "image", label: "Image", required: true },
        description: { type: "editor", label: "Description" },
        link: { type: "text", label: "Link URL" },
      },
    },
    "repeater-img-content": {
      label: "Repeater Image-Content",
      icon: Layout,
      fields: {
        image: { type: "image", label: "Image", required: true },
        subtitle: { type: "text", label: "Sub Title" },
        title: { type: "text", label: "Title" },
        description: { type: "text", label: "Description" },
        buttonTitle: { type: "text", label: "Button Title" },
        buttonUrl: { type: "text", label: "Button URL" },
        backgroundColor: { type: "text", label: "Background Color" },
      },
    },
    "editor": {
      label: "Text Editor",
      icon: Edit,
      fields: {
        content: { type: "editor", label: "Content", required: true },
      },
    },
  };

  // ✅ Add new section instance
  const addSectionInstance = () => {
    setSectionInstances((prev) => [...prev, {}]);
  };

  // ✅ Remove section instance
  const removeSectionInstance = (instanceIndex) => {
    if (sectionInstances.length > 1) {
      setSectionInstances((prev) => prev.filter((_, i) => i !== instanceIndex));

      // Clean up related states for this instance
      const newUploadedImages = {};
      const newImagePreviews = {};

      Object.keys(uploadedImages).forEach((key) => {
        if (!key.startsWith(`instance_${instanceIndex}.`)) {
          // Adjust keys for instances after the removed one
          const match = key.match(/^instance_(\d+)\./);
          if (match && parseInt(match[1]) > instanceIndex) {
            const newKey = key.replace(
              /^instance_\d+\./,
              `instance_${parseInt(match[1]) - 1}.`
            );
            newUploadedImages[newKey] = uploadedImages[key];
          } else if (!match || parseInt(match[1]) < instanceIndex) {
            newUploadedImages[key] = uploadedImages[key];
          }
        }
      });

      Object.keys(imagePreviews).forEach((key) => {
        if (!key.startsWith(`instance_${instanceIndex}.`)) {
          const match = key.match(/^instance_(\d+)\./);
          if (match && parseInt(match[1]) > instanceIndex) {
            const newKey = key.replace(
              /^instance_\d+\./,
              `instance_${parseInt(match[1]) - 1}.`
            );
            newImagePreviews[newKey] = imagePreviews[key];
          } else if (!match || parseInt(match[1]) < instanceIndex) {
            newImagePreviews[key] = imagePreviews[key];
          }
        }
      });

      setUploadedImages(newUploadedImages);
      setImagePreviews(newImagePreviews);
    }
  };

  // ✅ Utility to update nested state for specific instance
  const updateSectionField = (instanceIndex, fieldPath, value) => {
    setSectionInstances((prev) => {
      const newInstances = [...prev];
      const instance = { ...newInstances[instanceIndex] };

      const keys = fieldPath.split(".");
      let current = instance;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      newInstances[instanceIndex] = instance;

      return newInstances;
    });
  };

  // ✅ Handle image select
  const handleImageSelect = (instanceIndex, fieldPath, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageKey = `instance_${instanceIndex}.${fieldPath}`;
      setUploadedImages((prev) => ({ ...prev, [imageKey]: file }));

      const reader = new FileReader();
      reader.onload = (e) =>
        setImagePreviews((prev) => ({ ...prev, [imageKey]: e.target.result }));
      reader.readAsDataURL(file);

      updateSectionField(instanceIndex, fieldPath, file);
    }
  };

  // ✅ Remove image
  const removeImage = (instanceIndex, fieldPath) => {
    const imageKey = `instance_${instanceIndex}.${fieldPath}`;

    setUploadedImages((prev) => {
      const copy = { ...prev };
      delete copy[imageKey];
      return copy;
    });

    setImagePreviews((prev) => {
      const copy = { ...prev };
      delete copy[imageKey];
      return copy;
    });

    updateSectionField(instanceIndex, fieldPath, "");

    if (fileInputRefs.current[imageKey]) {
      fileInputRefs.current[imageKey].value = "";
    }
  };

  // ✅ Add/remove repeater item
  const addRepeaterItem = (instanceIndex, fieldPath) => {
    const currentInstance = sectionInstances[instanceIndex];
    const items =
      fieldPath.split(".").reduce((acc, key) => acc?.[key], currentInstance) ||
      [];
    updateSectionField(instanceIndex, fieldPath, [...items, {}]);
  };

  const removeRepeaterItem = (instanceIndex, fieldPath, itemIndex) => {
    const currentInstance = sectionInstances[instanceIndex];
    const items =
      fieldPath.split(".").reduce((acc, key) => acc?.[key], currentInstance) ||
      [];
    updateSectionField(
      instanceIndex,
      fieldPath,
      items.filter((_, i) => i !== itemIndex)
    );
  };

  // ✅ Submit form - Send all instances in one request
  const handleSubmit = async () => {
    if (!selectedType) return alert("Please select section type");

    try {
      const formData = new FormData();
      formData.append("type", selectedType);

      // Recursive helper to flatten nested object into dot notation
      const appendFields = (obj, prefix = "fields") => {
        Object.entries(obj).forEach(([key, value]) => {
          const path = `${prefix}.${key}`;
          if (value && typeof value === "object" && !(value instanceof File)) {
            if (Array.isArray(value)) {
              value.forEach((item, index) =>
                appendFields(item, `${path}.${index}`)
              );
            } else {
              appendFields(value, path);
            }
          } else {
            formData.append(path, value || "");
          }
        });
      };

      // Process each instance
      sectionInstances.forEach((instance, i) => {
        appendFields(instance, `fields.instance_${i}`);
      });

      // Add files with instance prefixes
      Object.entries(uploadedImages).forEach(([imageKey, file]) => {
        const fieldPath = imageKey; // imageKey already has instance_ prefix
        formData.append(`fields.${fieldPath}`, file);
      });

      await onAddSection(formData);

      // Reset form
      setSelectedType("");
      setSectionInstances([{}]);
      setUploadedImages({});
      setImagePreviews({});
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding sections:", error);
    }
  };

  // ✅ Render field dynamically
  const renderField = (
    instanceIndex,
    fieldName,
    fieldConfig,
    parentPath = ""
  ) => {
    const fieldPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
    const currentInstance = sectionInstances[instanceIndex];
    const value = fieldPath
      .split(".")
      .reduce((acc, key) => acc?.[key], currentInstance);
    const imageKey = `instance_${instanceIndex}.${fieldPath}`;

    switch (fieldConfig.type) {
      case "text":
        return (
          <div key={`${instanceIndex}-${fieldPath}`} className="mb-3">
            <label className="block text-sm font-medium mb-1">
              {fieldConfig.label}
            </label>
            <input
              type="text"
              value={value || ""}
              onChange={(e) =>
                updateSectionField(instanceIndex, fieldPath, e.target.value)
              }
              className="border px-3 py-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "editor":
        return (
          <div key={`${instanceIndex}-${fieldPath}`} className="mb-3">
            <label className="block text-sm font-medium mb-1">
              {fieldConfig.label}
            </label>
            <ReactQuill
              theme="snow"
              value={value || ""}
              onChange={(content) => updateSectionField(instanceIndex, fieldPath, content)}
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
              placeholder={`Enter ${fieldConfig.label.toLowerCase()}...`}
            />
          </div>
        );

      case "image":
        return (
          <div key={`${instanceIndex}-${fieldPath}`} className="mb-3">
            <label className="block text-sm font-medium mb-1">
              {fieldConfig.label}
            </label>
            {!imagePreviews[imageKey] ? (
              <input
                ref={(el) => (fileInputRefs.current[imageKey] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect(instanceIndex, fieldPath, e)}
                className="border px-3 py-2 w-full rounded"
              />
            ) : (
              <div className="relative">
                <img
                  src={imagePreviews[imageKey]}
                  className="h-32 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(instanceIndex, fieldPath)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        );

      case "repeater":
        const items = value || [];
        return (
          <div key={`${instanceIndex}-${fieldPath}`} className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                {fieldConfig.label}
              </label>
              <button
                type="button"
                onClick={() => addRepeaterItem(instanceIndex, fieldPath)}
                className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
            {items.map((item, idx) => (
              <div
                key={`${instanceIndex}-${fieldPath}-${idx}`}
                className="border p-3 rounded mb-2 relative bg-gray-50"
              >
                <button
                  type="button"
                  onClick={() =>
                    removeRepeaterItem(instanceIndex, fieldPath, idx)
                  }
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded"
                >
                  <X size={14} />
                </button>
                {Object.entries(fieldConfig.fields).map(
                  ([subName, subConfig]) =>
                    renderField(
                      instanceIndex,
                      subName,
                      subConfig,
                      `${fieldPath}.${idx}`
                    )
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!showAddForm) return null;

  return (
    <div className="bg-white shadow rounded p-6 max-h-96 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Add Section</h2>

      <select
        value={selectedType}
        onChange={(e) => {
          setSelectedType(e.target.value);
          // Reset instances when changing section type
          setSectionInstances([{}]);
          setUploadedImages({});
          setImagePreviews({});
        }}
        className="border p-3 rounded mb-4 w-full focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Section Type</option>
        {Object.entries(sectionTypes).map(([type, config]) => (
          <option key={type} value={type}>
            {config.label}
          </option>
        ))}
      </select>

      {selectedType && (
        <div>
          {/* Section instances */}
          {sectionInstances.map((instance, instanceIndex) => (
            <div
              key={instanceIndex}
              className="border rounded p-4 mb-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">
                  {sectionTypes[selectedType].label}{" "}
                  {sectionInstances.length > 1 ? `#${instanceIndex + 1}` : ""}
                </h3>
                {sectionInstances.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSectionInstance(instanceIndex)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {Object.entries(sectionTypes[selectedType].fields).map(
                ([name, config]) => renderField(instanceIndex, name, config)
              )}
            </div>
          ))}

          {/* Add more section button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={addSectionInstance}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Copy size={16} />
              Add Another {sectionTypes[selectedType].label}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={btnLoading || !selectedType}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {btnLoading
            ? "Adding..."
            : `Add ${sectionInstances.length} Section${
                sectionInstances.length > 1 ? "s" : ""
              }`}
        </button>
        <button
          onClick={() => {
            setShowAddForm(false);
            setSelectedType("");
            setSectionInstances([{}]);
            setUploadedImages({});
            setImagePreviews({});
          }}
          className="bg-gray-400 text-white px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddSectionForm;