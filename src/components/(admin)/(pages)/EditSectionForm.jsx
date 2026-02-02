"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Upload,
  X,
  Layout,
  Edit,
  Copy,
  Repeat,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

const EditSectionForm = ({
  editingSection,
  setEditingSection,
  onUpdateSection,
  btnLoading,
  pageData
}) => {
  const [sectionInstances, setSectionInstances] = useState([]);
  const [uploadedImages, setUploadedImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const fileInputRefs = useRef({});

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
      }
    },
    "image-box": {
      label: "Image Box",
      icon: ImageIcon,
      fields: {
        title: { type: "text", label: "Title", required: true },
        image: { type: "image", label: "Image", required: true },
        description: { type: "editor", label: "Description" },
        link: { type: "text", label: "Link URL" },
      }
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
      }
    },
    "features": {
      label: "Features",
      icon: Layout,
      fields: {
        items: {
          type: "repeater",
          label: "Feature Items",
          fields: {
            title: { type: "text", label: "Title", required: true },
            description: { type: "text", label: "Description" },
            icon: { type: "image", label: "Icon" },
          },
        },
      },
    },
  };

  // ✅ FIXED: Better image preview setup
  useEffect(() => {
    if (editingSection) {
      const instances = Array.isArray(editingSection.fields) 
        ? editingSection.fields 
        : [editingSection.fields || {}];
      
      setSectionInstances(instances);
     
      // 🔥 IMPROVED: Recursive image preview setup
      const setupImagePreviews = (instances) => {
        const previews = {};
        
        const processValue = (value, instanceIndex, currentPath) => {
          const imageKey = `instance_${instanceIndex}.${currentPath}`;
          
          // Check if it's an image URL
          if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/uploads'))) {
            previews[imageKey] = value;
            console.log('✅ Image found:', imageKey, value);
          }
          // Handle arrays (repeater items)
          else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'object' && item !== null) {
                Object.entries(item).forEach(([key, val]) => {
                  processValue(val, instanceIndex, `${currentPath}.${index}.${key}`);
                });
              }
            });
          }
          // Handle nested objects
          else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([key, val]) => {
              processValue(val, instanceIndex, `${currentPath}.${key}`);
            });
          }
        };

        instances.forEach((instance, instanceIndex) => {
          if (instance) {
            Object.entries(instance).forEach(([key, value]) => {
              processValue(value, instanceIndex, key);
            });
          }
        });
        
        console.log('📸 Image Previews Setup:', previews);
        setImagePreviews(previews);
      };
     
      setupImagePreviews(instances);
    }
  }, [editingSection]);

  const addSectionInstance = () => {
    setSectionInstances(prev => [...prev, {}]);
  };

  const removeSectionInstance = (instanceIndex) => {
    if (sectionInstances.length > 1) {
      setSectionInstances(prev => prev.filter((_, i) => i !== instanceIndex));
      
      const newUploadedImages = {};
      const newImagePreviews = {};
      
      Object.keys(uploadedImages).forEach(key => {
        if (!key.startsWith(`instance_${instanceIndex}.`)) {
          const match = key.match(/^instance_(\d+)\./);
          if (match && parseInt(match[1]) > instanceIndex) {
            const newKey = key.replace(/^instance_\d+\./, `instance_${parseInt(match[1]) - 1}.`);
            newUploadedImages[newKey] = uploadedImages[key];
          } else if (!match || parseInt(match[1]) < instanceIndex) {
            newUploadedImages[key] = uploadedImages[key];
          }
        }
      });

      Object.keys(imagePreviews).forEach(key => {
        if (!key.startsWith(`instance_${instanceIndex}.`)) {
          const match = key.match(/^instance_(\d+)\./);
          if (match && parseInt(match[1]) > instanceIndex) {
            const newKey = key.replace(/^instance_\d+\./, `instance_${parseInt(match[1]) - 1}.`);
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

  // ✅ Update field with proper nested handling
  const updateSectionField = (instanceIndex, fieldPath, value) => {
    console.log('🔄 Updating field:', { instanceIndex, fieldPath, value });
    
    setSectionInstances(prev => {
      const newInstances = [...prev];
      const instance = JSON.parse(JSON.stringify(newInstances[instanceIndex] || {}));
      
      const keys = fieldPath.split('.');
      let current = instance;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        
        // Handle array indices
        if (!isNaN(parseInt(nextKey))) {
          if (!Array.isArray(current[key])) {
            current[key] = [];
          }
        } else {
          if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
          }
        }
        current = current[key];
      }
      
      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;
      
      newInstances[instanceIndex] = instance;
      console.log('✅ Updated instance:', instance);
      
      return newInstances;
    });
  };

  const handleImageSelect = (instanceIndex, fieldPath, event) => {
    const file = event.target.files[0];
    if (file) {
      const imageKey = `instance_${instanceIndex}.${fieldPath}`;
      console.log('📤 Uploading image:', imageKey);
      
      setUploadedImages(prev => ({ ...prev, [imageKey]: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => ({ ...prev, [imageKey]: e.target.result }));
      };
      reader.readAsDataURL(file);
      
      // Don't update section field with File object, backend will handle it
      updateSectionField(instanceIndex, fieldPath, file.name);
    }
  };

  const removeImage = (instanceIndex, fieldPath) => {
    const imageKey = `instance_${instanceIndex}.${fieldPath}`;
    console.log('🗑️ Removing image:', imageKey);
    
    setUploadedImages(prev => {
      const copy = { ...prev };
      delete copy[imageKey];
      return copy;
    });
    
    setImagePreviews(prev => {
      const copy = { ...prev };
      delete copy[imageKey];
      return copy;
    });
    
    updateSectionField(instanceIndex, fieldPath, "");
    
    if (fileInputRefs.current[imageKey]) {
      fileInputRefs.current[imageKey].value = "";
    }
  };

  const addRepeaterItem = (instanceIndex, fieldPath) => {
    const currentInstance = sectionInstances[instanceIndex];
    const items = fieldPath.split(".").reduce((acc, key) => acc?.[key], currentInstance) || [];
    console.log('➕ Adding repeater item to:', fieldPath, 'Current items:', items);
    updateSectionField(instanceIndex, fieldPath, [...items, {}]);
  };

  const removeRepeaterItem = (instanceIndex, fieldPath, itemIndex) => {
    const currentInstance = sectionInstances[instanceIndex];
    const items = fieldPath.split(".").reduce((acc, key) => acc?.[key], currentInstance) || [];
    console.log('➖ Removing repeater item:', { fieldPath, itemIndex });
    
    // Remove image previews for this item
    const itemPath = `${fieldPath}.${itemIndex}`;
    const imageKey = `instance_${instanceIndex}.${itemPath}`;
    
    Object.keys(imagePreviews).forEach(key => {
      if (key.startsWith(imageKey)) {
        console.log('🗑️ Cleaning up image:', key);
        setImagePreviews(prev => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      }
    });
    
    updateSectionField(instanceIndex, fieldPath, items.filter((_, i) => i !== itemIndex));
  };

  const handleSubmit = async () => {
    if (!editingSection?.type) {
      alert("Section type is missing");
      return;
    }

    console.log('💾 Submitting section update...');
    console.log('Section Instances:', sectionInstances);
    console.log('Uploaded Images:', uploadedImages);

    const formData = new FormData();
    formData.append("pageId", pageData._id);
    formData.append("sectionId", editingSection._id);
    formData.append("type", editingSection.type);

    // Process each instance
    sectionInstances.forEach((instance, i) => {
      const addFieldsToFormData = (obj, prefix = `fields.instance_${i}`) => {
        Object.entries(obj).forEach(([key, value]) => {
          const fieldPath = `${prefix}.${key}`;

          if (value && typeof value === "object" && !(value instanceof File)) {
            if (Array.isArray(value)) {
              value.forEach((item, index) => {
                if (typeof item === "object" && !(item instanceof File)) {
                  addFieldsToFormData(item, `${fieldPath}.${index}`);
                } else {
                  formData.append(`${fieldPath}.${index}`, item || "");
                }
              });
            } else {
              addFieldsToFormData(value, fieldPath);
            }
          } else {
            formData.append(fieldPath, value || "");
          }
        });
      };

      addFieldsToFormData(instance);
    });

    // Add files with instance prefixes
    Object.entries(uploadedImages).forEach(([imageKey, file]) => {
      console.log('📎 Attaching file:', imageKey);
      formData.append(`fields.${imageKey}`, file);
    });

    // Debug FormData
    console.log('📤 FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, ':', value);
    }

    try {
      await onUpdateSection(formData);
      setUploadedImages({});
      setEditingSection(null);
    } catch (error) {
      console.error("❌ Error updating section:", error);
      alert(error.message || 'Failed to update section');
    }
  };

  const renderField = (instanceIndex, fieldName, fieldConfig, parentPath = '') => {
    const fieldPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
    const currentInstance = sectionInstances[instanceIndex];
    const value = fieldPath.split(".").reduce((acc, key) => acc?.[key], currentInstance);
    const imageKey = `instance_${instanceIndex}.${fieldPath}`;

    console.log('🎨 Rendering field:', { fieldName, fieldPath, imageKey, value });

    switch (fieldConfig.type) {
      case 'text':
        return (
          <div key={`${instanceIndex}-${fieldPath}`} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldConfig.label} {fieldConfig.required && '*'}
            </label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => updateSectionField(instanceIndex, fieldPath, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
            />
          </div>
        );

      case 'editor':
        return (
          <div key={`${instanceIndex}-${fieldPath}`} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldConfig.label} {fieldConfig.required && '*'}
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
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
                  "header", "bold", "italic", "underline", "strike",
                  "blockquote", "list", "link", "image",
                ]}
                placeholder={`Enter ${fieldConfig.label.toLowerCase()}...`}
              />
            </div>
          </div>
        );

      case 'image':
        const imagePreview = imagePreviews[imageKey];
        console.log('🖼️ Image field:', { imageKey, imagePreview });
        
        return (
          <div key={`${instanceIndex}-${fieldPath}`} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fieldConfig.label} {fieldConfig.required && '*'}
            </label>
           
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  ref={el => fileInputRefs.current[imageKey] = el}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(instanceIndex, fieldPath, e)}
                  className="hidden"
                  id={`edit-image-${imageKey}`}
                />
                <label htmlFor={`edit-image-${imageKey}`} className="cursor-pointer flex flex-col items-center">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload image</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeImage(instanceIndex, fieldPath)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        );

      case 'repeater':
        const items = value || [];
        console.log('🔁 Repeater field:', { fieldPath, items });
        
        return (
          <div key={`${instanceIndex}-${fieldPath}`} className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {fieldConfig.label}
              </label>
              <button
                type="button"
                onClick={() => addRepeaterItem(instanceIndex, fieldPath)}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 flex items-center gap-1"
              >
                <Plus size={14} />
                Add Item
              </button>
            </div>
           
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={`${instanceIndex}-${fieldPath}-${index}`} className="border border-gray-200 rounded-lg p-3 relative bg-gray-50">
                  <button
                    type="button"
                    onClick={() => removeRepeaterItem(instanceIndex, fieldPath, index)}
                    className="absolute top-2 right-2 text-red-600 hover:bg-red-100 p-1 rounded z-10"
                  >
                    <X size={14} />
                  </button>
                 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                    {Object.entries(fieldConfig.fields).map(([subFieldName, subFieldConfig]) =>
                      renderField(instanceIndex, subFieldName, subFieldConfig, `${fieldPath}.${index}`)
                    )}
                  </div>
                </div>
              ))}
             
              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  No items added yet. Click "Add Item" to get started.
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!editingSection) return null;

  const typeConfig = sectionTypes[editingSection.type];
  if (!typeConfig) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        Unknown section type: {editingSection.type}
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      {/* Section Type Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        {React.createElement(typeConfig.icon, { size: 24, className: "text-blue-600" })}
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Editing: {typeConfig.label}
          </h3>
          <p className="text-sm text-gray-500">
            Section ID: {editingSection._id} • {sectionInstances.length} instance{sectionInstances.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Section instances */}
      {sectionInstances.map((instance, instanceIndex) => (
        <div key={instanceIndex} className="border rounded-lg p-4 mb-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-800">
              {typeConfig.label} {sectionInstances.length > 1 ? `#${instanceIndex + 1}` : ''}
            </h4>
            {sectionInstances.length > 1 && (
              <button
                type="button"
                onClick={() => removeSectionInstance(instanceIndex)}
                className="text-red-500 hover:bg-red-100 p-2 rounded"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {Object.entries(typeConfig.fields).map(([fieldName, fieldConfig]) =>
              renderField(instanceIndex, fieldName, fieldConfig)
            )}
          </div>
        </div>
      ))}

      {/* Add more section button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={addSectionInstance}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
        >
          <Copy size={16} />
          Add Another {typeConfig.label}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={handleSubmit}
          disabled={btnLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save size={16} />
          {btnLoading ? "Saving..." : `Save ${sectionInstances.length} Instance${sectionInstances.length > 1 ? 's' : ''}`}
        </button>
        <button
          onClick={() => {
            setEditingSection(null);
            setUploadedImages({});
            setImagePreviews({});
          }}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditSectionForm;