"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Image,
  Settings,
  RefreshCw,
  Info,
  Camera,
  Monitor,
  Smartphone,
  FolderOpen,
  AlertCircle,
} from "lucide-react";
import { useMediaSettings } from "@/context/mediaSetting";

const MediaSettingsPage = () => {
  const { settings, saveSettings, loading, btnLoading, fetchSettings } =
    useMediaSettings();

  useEffect(() => {
    fetchSettings();
  }, []);

  const [formData, setFormData] = useState({
    thumbnail: {
      width: 150,
      height: 150,
      crop: true,
    },
    medium: {
      maxWidth: 300,
      maxHeight: 300,
    },
    large: {
      maxWidth: 1024,
      maxHeight: 1024,
    },
    organizeUploads: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Load settings into form when available
  useEffect(() => {
    if (settings) {
      setFormData({
        thumbnail: {
          width: settings.thumbnail?.width || 150,
          height: settings.thumbnail?.height || 150,
          crop:
            settings.thumbnail?.crop !== undefined
              ? settings.thumbnail.crop
              : true,
        },
        medium: {
          maxWidth: settings.medium?.maxWidth || 300,
          maxHeight: settings.medium?.maxHeight || 300,
        },
        large: {
          maxWidth: settings.large?.maxWidth || 1024,
          maxHeight: settings.large?.maxHeight || 1024,
        },
        organizeUploads:
          settings.organizeUploads !== undefined
            ? settings.organizeUploads
            : true,
      });
      setHasChanges(false);
    }
  }, [settings]);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleTopLevelChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSettings(formData);
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    setFormData({
      thumbnail: {
        width: 150,
        height: 150,
        crop: true,
      },
      medium: {
        maxWidth: 300,
        maxHeight: 300,
      },
      large: {
        maxWidth: 1024,
        maxHeight: 1024,
      },
      organizeUploads: true,
    });
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-gray-600">Loading media settings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Image className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Settings</h1>
            <p className="text-gray-600 mt-1">
              Configure image sizes and upload organization preferences
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Image Size Settings</p>
            <p>
              These settings determine the maximum dimensions for images when
              they are uploaded to your site. Changes will only affect new
              uploads, not existing images.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Sizes */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Image Sizes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Thumbnail Size */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-gray-900">Thumbnail Size</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={formData.thumbnail.width}
                      onChange={(e) =>
                        handleInputChange(
                          "thumbnail",
                          "width",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={formData.thumbnail.height}
                      onChange={(e) =>
                        handleInputChange(
                          "thumbnail",
                          "height",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="thumbnail-crop"
                    checked={formData.thumbnail.crop}
                    onChange={(e) =>
                      handleInputChange("thumbnail", "crop", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="thumbnail-crop"
                    className="text-sm text-gray-700"
                  >
                    Crop thumbnail to exact dimensions
                  </label>
                </div>
              </div>
            </div>

            {/* Medium Size */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Medium Size</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Width
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={formData.medium.maxWidth}
                      onChange={(e) =>
                        handleInputChange(
                          "medium",
                          "maxWidth",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Height
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={formData.medium.maxHeight}
                      onChange={(e) =>
                        handleInputChange(
                          "medium",
                          "maxHeight",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Images will be resized proportionally to fit within these
                  dimensions
                </p>
              </div>
            </div>

            {/* Large Size */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium text-gray-900">Large Size</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Width
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="4000"
                      value={formData.large.maxWidth}
                      onChange={(e) =>
                        handleInputChange(
                          "large",
                          "maxWidth",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Height
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="4000"
                      value={formData.large.maxHeight}
                      onChange={(e) =>
                        handleInputChange(
                          "large",
                          "maxHeight",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Images will be resized proportionally to fit within these
                  dimensions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Organization */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Upload Organization
          </h2>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  id="organize-uploads"
                  checked={formData.organizeUploads}
                  onChange={(e) =>
                    handleTopLevelChange("organizeUploads", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <label
                    htmlFor="organize-uploads"
                    className="font-medium text-gray-900"
                  >
                    Organize uploads into month- and year-based folders
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Files will be organized into folders like{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      /uploads/2024/01/
                    </code>{" "}
                    for better organization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Size Examples */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-2">
                Current Size Examples
              </h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>
                  <strong>Thumbnail:</strong> {formData.thumbnail.width} ×{" "}
                  {formData.thumbnail.height}px{" "}
                  {formData.thumbnail.crop ? "(cropped)" : "(scaled)"}
                </p>
                <p>
                  <strong>Medium:</strong> Up to {formData.medium.maxWidth} ×{" "}
                  {formData.medium.maxHeight}px (scaled proportionally)
                </p>
                <p>
                  <strong>Large:</strong> Up to {formData.large.maxWidth} ×{" "}
                  {formData.large.maxHeight}px (scaled proportionally)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={resetToDefaults}
            disabled={btnLoading}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} />
            Reset to Defaults
          </button>

          <div className="flex gap-3 sm:ml-auto">
            <button
              type="submit"
              disabled={btnLoading || !hasChanges}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              {btnLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Changes indicator */}
        {hasChanges && !btnLoading && (
          <div className="text-center">
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg py-2 px-4 inline-block">
              You have unsaved changes
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default MediaSettingsPage;
