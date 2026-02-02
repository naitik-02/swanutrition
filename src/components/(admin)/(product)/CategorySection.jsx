import React, { useState, useRef, useEffect } from "react";
import { Tag, X, Search, ChevronDown, Check } from "lucide-react";

const CategorySection = ({
  category,
  setCategory,
  subcategory,
  setSubcategory,
  categories,
  subcategories,
  tags,

  setTags,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Tag className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">Category & Tags</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategory
          </label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            disabled={!category}
          >
            <option value="">Select Subcategory</option>
            {subcategories
              .filter((sub) => sub.category._id === category)
              .map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Tags
          </label>

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="eg: protein, whey, fitness, muscle"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <p className="text-xs text-gray-500 mt-1">
            Use comma ( , ) to separate tags
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
