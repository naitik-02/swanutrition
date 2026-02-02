"use client";
import React, { useEffect } from "react";
import { Package } from "lucide-react";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    ["link", "image"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "link",
  "image",
];

const BasicInformation = ({
  brands,
  title,
  shortDescription,
  setShortDescription,
  slug,
  brand,
  description,
  ingredient,
  usage,
  benefit,
  setTitle,
  setSlug,
  setBrand,
  setDescription,
  setIngredient,
  setUsage,
  setBenefit,
}) => {
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(generatedSlug);
    }
  }, [title]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">
            Basic Information
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter product title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          {brands?.length > 0 ? (
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex justify-between items-center border px-3 py-2 rounded-md bg-gray-50">
              <span className="text-sm text-gray-600">No brands available</span>
              <a
                href="/admin/product/brands"
                className="text-blue-600 text-sm font-medium"
              >
                Create Brand
              </a>
            </div>
          )}
        </div>

        <RichEditor
          label="Description"
          value={description}
          onChange={setDescription}
        />

        <RichEditor
          label="Ingredients"
          value={ingredient}
          onChange={setIngredient}
        />

        <RichEditor
          label="Usage"
          value={usage}
          onChange={setUsage}
        />

        <RichEditor
          label="Benefits"
          value={benefit}
          onChange={setBenefit}
        />
      </div>
    </div>
  );
};

const RichEditor = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="border border-gray-300 rounded-md">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        className=""
      />
    </div>
  </div>
);

export default BasicInformation;
