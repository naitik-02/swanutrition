"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Info,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

const ProductImportPage = () => {
  const [file, setFile] = useState(null);
  const [importSettings, setImportSettings] = useState({
    updateExisting: false,
    skipDuplicates: true,
  });
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [csvPreview, setCsvPreview] = useState(null);

  const fileInputRef = useRef(null);

  const sampleData = [
    {
      title: "Sample Product 1",
      slug: "sample-product-1",
      description: "This is a sample product description",
      features: "Feature 1, Feature 2, Feature 3",
      shelfLife: "12 months",
      countryOfOrigin: "India",
      fssaiLicense: "12345678901234",
      stock: "100",
      sold: "25",
      units: '[{"size":"250g","price":150,"discountPrice":120}]',
      returnable: "true",
      returnPolicyNotes: "30 days return policy",
      category: "60a1b2c3d4e5f6789abcdef0",
      subcategory: "60a1b2c3d4e5f6789abcdef1",
      brand: "60a1b2c3d4e5f6789abcdef2",
      images: '["image1.jpg","image2.jpg"]',
    },
  ];

  const requiredFields = [
    "title",
    "slug",
    "description",
    "features",
    "shelfLife",
    "countryOfOrigin",
    "fssaiLicense",
    "stock",
    "sold",
    "units",
    "returnable",
    "returnPolicyNotes",
    "category",
    "subcategory",
    "brand",
    "images",
  ];

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        setImportStatus({
          type: "error",
          message: "Please select a valid CSV file.",
        });
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        setImportStatus({
          type: "error",
          message: "File size must be less than 10MB.",
        });
        return;
      }

      setFile(selectedFile);
      setImportStatus(null);
      setImportResults(null);

      // Preview CSV content
      previewCSV(selectedFile);
    }
  };

  const previewCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split("\n");
      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
      const rows = lines
        .slice(1, 6)
        .map((line) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || "";
            return obj;
          }, {});
        })
        .filter((row) => Object.values(row).some((val) => val !== ""));

      setCsvPreview({ headers, rows });
    };
    reader.readAsText(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect({ target: { files: [droppedFile] } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    setCsvPreview(null);
    setImportStatus(null);
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    if (!file) {
      setImportStatus({
        type: "error",
        message: "Please select a file to import.",
      });
      return;
    }

    setIsImporting(true);
    setImportStatus(null);
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("updateExisting", importSettings.updateExisting);
      formData.append("skipDuplicates", importSettings.skipDuplicates);

      const response = await fetch("/api/Admin/product/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setImportStatus({
          type: "success",
          message: result.message,
        });
        setImportResults(result.results);
      } else {
        setImportStatus({
          type: "error",
          message: result.message || "Import failed",
        });
      }
    } catch (error) {
      setImportStatus({
        type: "error",
        message: error.message || "An error occurred during import",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Import Products
        </h1>
        <p className="text-gray-600">
          Import products from CSV file. Download the sample file to see the
          required format.
        </p>
      </div>

      {/* Status Messages */}
      {importStatus && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            importStatus.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {importStatus.type === "success" ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          {importStatus.message}
        </div>
      )}

      {/* Import Results */}
      {importResults && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Import Results
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {importResults.total}
              </div>
              <div className="text-sm text-blue-800">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {importResults.imported}
              </div>
              <div className="text-sm text-green-800">Imported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {importResults.updated}
              </div>
              <div className="text-sm text-orange-800">Updated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {importResults.skipped}
              </div>
              <div className="text-sm text-gray-800">Skipped</div>
            </div>
          </div>

          {importResults.errors && importResults.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-red-800 mb-2">
                Errors ({importResults.errors.length}):
              </h4>
              <div className="max-h-32 overflow-y-auto">
                {importResults.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700 mb-1">
                    Row {error.row}: {error.message}{" "}
                    {error.data && `(${error.data})`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File Upload Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload CSV File
            </h2>

            {/* File Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            >
              {file ? (
                <div className="flex items-center justify-center">
                  <FileText className="h-12 w-12 text-green-500 mr-4" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      onClick={removeFile}
                      className="mt-2 text-red-600 hover:text-red-800 flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">
                    Drop your CSV file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Maximum file size: 10MB
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!file && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
              >
                <Upload className="h-5 w-5 mr-2" />
                Select CSV File
              </button>
            )}

            {/* CSV Preview */}
            {csvPreview && (
              <div className="mt-6">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-blue-600 hover:text-blue-800 flex items-center mb-3"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  {showPreview ? "Hide" : "Show"} Preview
                </button>

                {showPreview && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {csvPreview.headers.map((header, index) => (
                              <th
                                key={index}
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {csvPreview.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {csvPreview.headers.map((header, colIndex) => (
                                <td
                                  key={colIndex}
                                  className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                                >
                                  {row[header] || "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Import Settings */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Import Settings
              </h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importSettings.updateExisting}
                    onChange={(e) =>
                      setImportSettings((prev) => ({
                        ...prev,
                        updateExisting: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Update existing products
                  </span>
                  <Info className="h-4 w-4 ml-1 text-gray-400" />
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importSettings.skipDuplicates}
                    onChange={(e) =>
                      setImportSettings((prev) => ({
                        ...prev,
                        skipDuplicates: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Skip duplicate products
                  </span>
                  <Info className="h-4 w-4 ml-1 text-gray-400" />
                </label>
              </div>
            </div>

            {/* Import Button */}
            <button
              onClick={handleImport}
              disabled={isImporting || !file}
              className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Import Products
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Instructions
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Step 2: Prepare Your Data
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use the same column headers as the sample</li>
                  <li>• Title field is required</li>
                  <li>• JSON fields (units, images) should be valid JSON</li>
                  <li>• Boolean fields: use 'true' or 'false'</li>
                  <li>• Numbers should be numeric values</li>
                  <li>• Category/subcategory/brand should be ObjectIds</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Step 3: Upload & Import
                </h3>
                <p className="text-sm text-gray-600">
                  Upload your CSV file and configure import settings as needed.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-yellow-800">
                  Important Notes
                </h3>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Always backup your data before importing</li>
                <li>• Test with a small file first</li>
                <li>• Use valid ObjectIds for category/subcategory/brand</li>
                <li>• File size limit: 10MB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImportPage;
