"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCategoryContext } from "@/context/category";

const ProductExportPage = () => {
  const [filters, setFilters] = useState({
    categories: [],
  });

  const [selectedFields, setSelectedFields] = useState([
    "title",
    "slug",
    "stock",
  ]);

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const { categories } = useCategoryContext();

  const availableFields = [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Description" },
    { key: "features", label: "Features" },
    { key: "shelfLife", label: "Shelf Life" },
    { key: "countryOfOrigin", label: "Country of Origin" },
    { key: "fssaiLicense", label: "FSSAI License" },
    { key: "stock", label: "Stock" },
    { key: "sold", label: "Sold" },
    { key: "units", label: "Units (JSON)" },
    { key: "returnable", label: "Returnable" },
    { key: "returnPolicyNotes", label: "Return Policy Notes" },
    { key: "category", label: "Category" },
    { key: "subcategory", label: "Subcategory" },
    { key: "brand", label: "Brand" },
    { key: "images", label: "Images" },
    { key: "createdAt", label: "Created Date" },
    { key: "updatedAt", label: "Updated Date" },
  ];

  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleFieldChange = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
    });
  };

  const selectAllFields = () => {
    setSelectedFields(availableFields.map((f) => f.key));
  };

  const clearAllFields = () => {
    setSelectedFields([]);
  };

  const buildExportUrl = () => {
    const params = new URLSearchParams();

    filters.categories.forEach((cat) => {
      params.append("category", cat);
    });

    if (filters.brand) params.append("brand", filters.brand);
    if (filters.stock) params.append("stock", filters.stock);
    if (filters.search) params.append("search", filters.search);

    return `/api/Admin/product/export?${params.toString()}`;
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      setExportStatus({
        type: "error",
        message: "Please select at least one field to export.",
      });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      const url = buildExportUrl();

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: selectedFields,
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `products-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setExportStatus({
        type: "success",
        message: "Products exported successfully!",
      });
    } catch (error) {
      setExportStatus({ type: "error", message: error.message });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Export Products
        </h1>
        <p className="text-gray-600">
          Export your products to CSV format with custom fields and filters.
        </p>
      </div>

      {exportStatus && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            exportStatus.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {exportStatus.type === "success" ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {exportStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Export Fields
              </h2>
              <div className="space-x-2">
                <button
                  onClick={selectAllFields}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
                <button
                  onClick={clearAllFields}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {availableFields.map((field) => (
                <label
                  key={field.key}
                  className="flex items-center p-2 hover:bg-gray-100 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => handleFieldChange(field.key)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {field.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Selected Fields Summary */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                Selected Fields ({selectedFields.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFields.map((field) => {
                  const fieldInfo = availableFields.find(
                    (f) => f.key === field
                  );
                  return (
                    <span
                      key={field}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {fieldInfo?.label}
                      <button
                        onClick={() => handleFieldChange(field)}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isExporting || selectedFields.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Export Products
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductExportPage;
