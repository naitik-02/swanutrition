"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Eye, Star, Grid, Search, Plus, Trash2 } from "lucide-react";
import { useCategoryContext } from "@/context/category";
import { useTopCategoriesContext } from "@/context/topcategory";

const TopCategoriesPage = () => {
  const { categories, fetchCategories } = useCategoryContext();
  const { 
    topCategories, 
    addTopCategories, 
    removeTopCategory, 
    loading, 
    btnLoading, 
    topCategoriesLoading 
  } = useTopCategoriesContext();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Add new top categories
  const handleAddTopCategories = async () => {
    if (selectedCategories.length === 0) {
      return;
    }

    await addTopCategories(selectedCategories);
    setSelectedCategories([]);
  };

  // Delete top category
  const handleDeleteTopCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to remove this category from top categories?")) {
      return;
    }

    await removeTopCategory(categoryId);
  };

  // Toggle category selection
  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filter available categories (exclude already selected top categories)
  const availableCategories = categories.filter(category => 
    !topCategories.some(topCat => topCat._id === category._id) &&
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Start editing
  const startEdit = (topCategory) => {
    setEditingId(topCategory._id);
    setEditData({ priority: topCategory.priority || 0 });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ priority: 0 });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading || topCategoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Top Categories Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Select and manage categories to display as top categories
              </p>
            </div>
          </div>
          <button
            onClick={handleAddTopCategories}
            disabled={btnLoading || selectedCategories.length === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={16} />
            {btnLoading ? "Adding..." : `Add Selected (${selectedCategories.length})`}
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left side - Available Categories */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <Grid size={16} />
                    Available Categories
                  </h3>
                  <span className="text-sm text-gray-500">
                    {availableCategories.length} categories available
                  </span>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search categories..."
                  />
                </div>
              </div>

              <div className="p-4">
                {availableCategories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Grid size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No categories available</p>
                    <p className="text-sm">All categories are already in top categories or none exist</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableCategories.map(category => (
                      <div
                        key={category._id}
                        onClick={() => toggleCategorySelection(category._id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCategories.includes(category._id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {category.image && (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <h4 className="font-medium text-gray-900">{category.name}</h4>
                              <p className="text-sm text-gray-500">{category.description}</p>
                            </div>
                          </div>
                          {selectedCategories.includes(category._id) && (
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Current Top Categories */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Star size={16} />
                  Current Top Categories
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {topCategories.length} categories selected
                </p>
              </div>
              
              <div className="p-4">
                {topCategories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Star size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No top categories selected</p>
                    <p className="text-sm">Select categories from the left panel</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topCategories.map(category => (
                      <div key={category._id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {category.image && (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {category.name}
                              </h4>
                              <p className="text-xs text-gray-500">{category.description}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteTopCategory(category._id)}
                            disabled={btnLoading}
                            className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h4 className="font-medium text-blue-900 mb-2">📊 Quick Stats</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Total Categories:</strong> {categories.length}</p>
                <p><strong>Top Categories:</strong> {topCategories.length}</p>
                <p><strong>Available to Add:</strong> {availableCategories.length}</p>
                <p><strong>Currently Selected:</strong> {selectedCategories.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCategoriesPage;