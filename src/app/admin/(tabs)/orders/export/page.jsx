"use client";

import React, { useState } from "react";
import {
  Download,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const OrderExportPage = () => {
  const [selectedFields, setSelectedFields] = useState([
    "userId",
    "totalAmount",
    "orderStatus",
  ]);

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const availableFields = [
    { key: "userId", label: "User" },
    { key: "items", label: "Items (JSON)" },
    { key: "address", label: "Address" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "orderStatus", label: "Order Status" },
    { key: "totalItems", label: "Total Items" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "deliveredAt", label: "Delivered At" },
    { key: "createdAt", label: "Created Date" },
    { key: "updatedAt", label: "Updated Date" },
  ];

  const handleFieldChange = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const selectAllFields = () => {
    setSelectedFields(availableFields.map((f) => f.key));
  };

  const clearAllFields = () => {
    setSelectedFields([]);
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
      const response = await fetch("/api/Admin/order/export", {
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
      link.download = `orders-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setExportStatus({
        type: "success",
        message: "Orders exported successfully!",
      });
    } catch (error) {
      setExportStatus({ type: "error", message: error.message });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Export Orders
        </h1>
        <p className="text-gray-600">
          Export your orders to CSV format with custom fields.
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
              Export Orders
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderExportPage;