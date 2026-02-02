"use client"

import React, { useState, useEffect } from 'react';
import { useStoreProducts } from '@/context/storeProduct';
import { Save, Star, MessageSquare, Ruler, Package } from 'lucide-react';

const ProductSettingsPage = () => {
  const { 
    storeProducts, 
    loading, 
    btnLoading, 
    saveStoreProducts 
  } = useStoreProducts();

  const [formData, setFormData] = useState({
    reviews: {
      enableProductReviews: true,
      showVerifiedOwnerLabel: true,
      reviewsOnlyByVerifiedOwners: false
    },
    ratings: {
      enableStarRating: true,
      requireStarRating: false
    },
    measurementUnits: {
      weightUnit: 'kg',
      dimensionUnit: 'cm'
    },
    inventory: {
      enableStockManagement: true,
      holdStockMinutes: 60,
      allowBackorders: 'no',
      notifyLowStock: true,
      lowStockThreshold: 2,
      outOfStockThreshold: 0
    }
  });

  useEffect(() => {
    if (storeProducts) {
      setFormData({
        reviews: {
          enableProductReviews: storeProducts.reviews?.enableProductReviews ?? true,
          showVerifiedOwnerLabel: storeProducts.reviews?.showVerifiedOwnerLabel ?? true,
          reviewsOnlyByVerifiedOwners: storeProducts.reviews?.reviewsOnlyByVerifiedOwners ?? false
        },
        ratings: {
          enableStarRating: storeProducts.ratings?.enableStarRating ?? true,
          requireStarRating: storeProducts.ratings?.requireStarRating ?? false
        },
        measurementUnits: {
          weightUnit: storeProducts.measurementUnits?.weightUnit || 'kg',
          dimensionUnit: storeProducts.measurementUnits?.dimensionUnit || 'cm'
        },
        inventory: {
          enableStockManagement: storeProducts.inventory?.enableStockManagement ?? true,
          holdStockMinutes: storeProducts.inventory?.holdStockMinutes ?? 60,
          allowBackorders: storeProducts.inventory?.allowBackorders || 'no',
          notifyLowStock: storeProducts.inventory?.notifyLowStock ?? true,
          lowStockThreshold: storeProducts.inventory?.lowStockThreshold ?? 2,
          outOfStockThreshold: storeProducts.inventory?.outOfStockThreshold ?? 0
        }
      });
    }
  }, [storeProducts]);

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    await saveStoreProducts(formData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Product Settings</h1>
          <p className="text-gray-600 mt-1">Configure product reviews, ratings, measurements, and inventory management</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Reviews Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Product Reviews</h2>
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableProductReviews"
                  checked={formData.reviews.enableProductReviews}
                  onChange={(e) => handleNestedChange('reviews', 'enableProductReviews', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableProductReviews" className="ml-3 text-sm text-gray-700">
                  Enable product reviews
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showVerifiedOwnerLabel"
                  checked={formData.reviews.showVerifiedOwnerLabel}
                  onChange={(e) => handleNestedChange('reviews', 'showVerifiedOwnerLabel', e.target.checked)}
                  disabled={!formData.reviews.enableProductReviews}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="showVerifiedOwnerLabel" className="ml-3 text-sm text-gray-700">
                  Show "verified owner" label on customer reviews
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reviewsOnlyByVerifiedOwners"
                  checked={formData.reviews.reviewsOnlyByVerifiedOwners}
                  onChange={(e) => handleNestedChange('reviews', 'reviewsOnlyByVerifiedOwners', e.target.checked)}
                  disabled={!formData.reviews.enableProductReviews}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="reviewsOnlyByVerifiedOwners" className="ml-3 text-sm text-gray-700">
                  Allow reviews only from verified owners
                </label>
              </div>
            </div>
          </div>

          {/* Ratings Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-medium text-gray-900">Product Ratings</h2>
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableStarRating"
                  checked={formData.ratings.enableStarRating}
                  onChange={(e) => handleNestedChange('ratings', 'enableStarRating', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableStarRating" className="ml-3 text-sm text-gray-700">
                  Enable star rating on reviews
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireStarRating"
                  checked={formData.ratings.requireStarRating}
                  onChange={(e) => handleNestedChange('ratings', 'requireStarRating', e.target.checked)}
                  disabled={!formData.ratings.enableStarRating}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="requireStarRating" className="ml-3 text-sm text-gray-700">
                  Star ratings are required, not optional
                </label>
              </div>
            </div>
          </div>

          {/* Measurement Units Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-medium text-gray-900">Measurement Units</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight Unit
                </label>
                <select
                  value={formData.measurementUnits.weightUnit}
                  onChange={(e) => handleNestedChange('measurementUnits', 'weightUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="lbs">Pound (lbs)</option>
                  <option value="oz">Ounce (oz)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimension Unit
                </label>
                <select
                  value={formData.measurementUnits.dimensionUnit}
                  onChange={(e) => handleNestedChange('measurementUnits', 'dimensionUnit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cm">Centimeter (cm)</option>
                  <option value="m">Meter (m)</option>
                  <option value="mm">Millimeter (mm)</option>
                  <option value="in">Inch (in)</option>
                  <option value="yd">Yard (yd)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-medium text-gray-900">Inventory Management</h2>
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableStockManagement"
                  checked={formData.inventory.enableStockManagement}
                  onChange={(e) => handleNestedChange('inventory', 'enableStockManagement', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enableStockManagement" className="ml-3 text-sm text-gray-700">
                  Enable stock management at product level
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hold Stock (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.inventory.holdStockMinutes}
                    onChange={(e) => handleNestedChange('inventory', 'holdStockMinutes', parseInt(e.target.value) || 0)}
                    disabled={!formData.inventory.enableStockManagement}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hold stock for unpaid orders (in minutes)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allow Backorders
                  </label>
                  <select
                    value={formData.inventory.allowBackorders}
                    onChange={(e) => handleNestedChange('inventory', 'allowBackorders', e.target.value)}
                    disabled={!formData.inventory.enableStockManagement}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="no">Do not allow</option>
                    <option value="yes">Allow</option>
                    <option value="notify">Allow, but notify customer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifyLowStock"
                  checked={formData.inventory.notifyLowStock}
                  onChange={(e) => handleNestedChange('inventory', 'notifyLowStock', e.target.checked)}
                  disabled={!formData.inventory.enableStockManagement}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <label htmlFor="notifyLowStock" className="ml-3 text-sm text-gray-700">
                  Enable low stock notifications
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.inventory.lowStockThreshold}
                    onChange={(e) => handleNestedChange('inventory', 'lowStockThreshold', parseInt(e.target.value) || 0)}
                    disabled={!formData.inventory.enableStockManagement}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Notify when stock reaches this level</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Out of Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.inventory.outOfStockThreshold}
                    onChange={(e) => handleNestedChange('inventory', 'outOfStockThreshold', parseInt(e.target.value) || 0)}
                    disabled={!formData.inventory.enableStockManagement}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mark as out of stock when reaches this level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={btnLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {btnLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {btnLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSettingsPage;