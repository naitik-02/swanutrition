"use client";

import React, { useState, useEffect } from "react";
import { Save, Link, RefreshCw, Info, AlertCircle } from "lucide-react";

const PermalinkSettingsPage = () => {
  const [formData, setFormData] = useState({
    structure: "post-name",
    customStructure: "",
    categoryBase: "category",
    tagBase: "tag",
    productBase: "product",
    productCategoryBase: "product-category",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Permalink structure options
  const permalinkOptions = [
    {
      id: "plain",
      label: "Plain",
      structure: "?p=123",
      example: "https://yoursite.com/?p=123",
    },
    {
      id: "day-name",
      label: "Day and name",
      structure: "/%year%/%monthnum%/%day%/%postname%/",
      example: "https://yoursite.com/2024/07/21/sample-post/",
    },
    {
      id: "month-name",
      label: "Month and name",
      structure: "/%year%/%monthnum%/%postname%/",
      example: "https://yoursite.com/2024/07/sample-post/",
    },
    {
      id: "numeric",
      label: "Numeric",
      structure: "/archives/%post_id%",
      example: "https://yoursite.com/archives/123",
    },
    {
      id: "post-name",
      label: "Post name",
      structure: "/%postname%/",
      example: "https://yoursite.com/sample-post/",
    },
    {
      id: "custom",
      label: "Custom Structure",
      structure: "",
      example: "Enter a custom structure above",
    },
  ];

  const handleStructureChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      structure: value,
    }));
    setHasChanges(true);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setBtnLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setBtnLoading(false);
    setHasChanges(false);

    console.log("Permalink settings saved:", formData);
  };

  const resetToDefaults = () => {
    setFormData({
      structure: "post-name",
      customStructure: "",
      categoryBase: "category",
      tagBase: "tag",
      productBase: "product",
      productCategoryBase: "product-category",
    });
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-gray-600">Loading permalink settings...</div>
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
            <Link className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Permalink Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Choose how your post URLs should look
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Permalink Structure</p>
            <p>
              These settings control how the URLs to your individual posts look.
              For more advanced options, you may want to choose a "pretty"
              structure that doesn't include "?p=" in the URL.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Common Settings */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Common Settings
          </h2>

          <div className="space-y-4">
            {permalinkOptions.map((option) => (
              <div
                key={option.id}
                className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all duration-200 ${
                  formData.structure === option.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleStructureChange(option.id)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="permalink-structure"
                    value={option.id}
                    checked={formData.structure === option.id}
                    onChange={() => handleStructureChange(option.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900">
                        {option.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                      {option.example}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Custom Structure Input */}
            {formData.structure === "custom" && (
              <div className="bg-white rounded-lg p-4 border border-gray-200 ml-7">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Structure
                    </label>
                    <input
                      type="text"
                      value={formData.customStructure}
                      onChange={(e) =>
                        handleInputChange("customStructure", e.target.value)
                      }
                      placeholder="/%year%/%monthnum%/%postname%/"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    Available tags: %year% %monthnum% %day% %hour% %minute%
                    %second% %postname% %post_id% %category% %author%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Optional</h2>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-4">
              If you like, you may enter custom structures for your category and
              tag URLs here. For example, using{" "}
              <code className="bg-gray-100 px-1 rounded">topics</code> as your
              category base would make your category links look like{" "}
              <code className="bg-gray-100 px-1 rounded">
                https://example.org/topics/uncategorized/
              </code>
              . If you leave these blank the defaults will be used.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category base
                </label>
                <input
                  type="text"
                  value={formData.categoryBase}
                  onChange={(e) =>
                    handleInputChange("categoryBase", e.target.value)
                  }
                  placeholder="category"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag base
                </label>
                <input
                  type="text"
                  value={formData.tagBase}
                  onChange={(e) => handleInputChange("tagBase", e.target.value)}
                  placeholder="tag"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Permalinks */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Product Permalinks
          </h2>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-4">
              These settings control the product URLs for your WooCommerce
              store.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product base
                </label>
                <input
                  type="text"
                  value={formData.productBase}
                  onChange={(e) =>
                    handleInputChange("productBase", e.target.value)
                  }
                  placeholder="product"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: https://yoursite.com/
                  {formData.productBase || "product"}/sample-product/
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product category base
                </label>
                <input
                  type="text"
                  value={formData.productCategoryBase}
                  onChange={(e) =>
                    handleInputChange("productCategoryBase", e.target.value)
                  }
                  placeholder="product-category"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: https://yoursite.com/
                  {formData.productCategoryBase || "product-category"}
                  /electronics/
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Selection Preview */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-2">
                Current Permalink Structure
              </h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <div>
                  <p className="font-medium mb-1">Post URLs:</p>
                  <div className="bg-white rounded p-3 border">
                    <code className="text-blue-600">
                      {formData.structure === "custom" &&
                      formData.customStructure
                        ? `https://yoursite.com${formData.customStructure
                            .replace(/%postname%/g, "sample-post")
                            .replace(/%year%/g, "2024")
                            .replace(/%monthnum%/g, "07")
                            .replace(/%day%/g, "21")}`
                        : permalinkOptions.find(
                            (option) => option.id === formData.structure
                          )?.example}
                    </code>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-1">Category URLs:</p>
                  <div className="bg-white rounded p-3 border">
                    <code className="text-blue-600">
                      https://yoursite.com/{formData.categoryBase || "category"}
                      /technology/
                    </code>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-1">Product URLs:</p>
                  <div className="bg-white rounded p-3 border">
                    <code className="text-blue-600">
                      https://yoursite.com/{formData.productBase || "product"}
                      /sample-product/
                    </code>
                  </div>
                </div>
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
              type="button"
              onClick={handleSubmit}
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
      </div>
    </div>
  );
};

export default PermalinkSettingsPage;
