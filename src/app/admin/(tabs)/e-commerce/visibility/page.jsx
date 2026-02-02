"use client"

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Globe, Clock, Save, AlertCircle } from 'lucide-react';
import { useVisibilityContext } from '@/context/storeVisibility';

export default function StoreVisibilitySettings() {
  const { visibility, loading, btnLoading, updateVisibilitySettings } = useVisibilityContext();
  const [selectedMode, setSelectedMode] = useState('live');

  useEffect(() => {
    if (visibility?.mode) {
      setSelectedMode(visibility.mode);
    }
  }, [visibility]);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  const handleSave = () => {
    updateVisibilitySettings(selectedMode);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Globe className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Store Visibility</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Control who can see your store and when it becomes available to customers.
          </p>
        </div>

        <div className="p-6">
          {/* Current Status Banner */}
          <div className={`mb-8 p-4 rounded-lg border ${
            selectedMode === 'live' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-3">
              {selectedMode === 'live' ? (
                <Eye className="h-5 w-5 text-green-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <h3 className={`font-medium ${
                  selectedMode === 'live' ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  Store is currently {selectedMode === 'live' ? 'Live' : 'Coming Soon'}
                </h3>
                <p className={`text-sm ${
                  selectedMode === 'live' ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {selectedMode === 'live' 
                    ? 'Your store is visible to all visitors and customers can make purchases.'
                    : 'Your store is hidden from public view. Only administrators can access it.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Visibility Options */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Choose Store Visibility</h2>
            
            <div className="space-y-4">
              {/* Live Option */}
              <div 
                className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMode === 'live'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleModeChange('live')}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      name="visibility-mode"
                      value="live"
                      checked={selectedMode === 'live'}
                      onChange={() => handleModeChange('live')}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-medium text-gray-900">Live Store</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Your store is fully operational and visible to all visitors. Customers can browse products, 
                      add items to cart, and complete purchases.
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Recommended for active stores</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coming Soon Option */}
              <div 
                className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMode === 'coming-soon'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleModeChange('coming-soon')}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <input
                      type="radio"
                      name="visibility-mode"
                      value="coming-soon"
                      checked={selectedMode === 'coming-soon'}
                      onChange={() => handleModeChange('coming-soon')}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Hide your store from public view while you're setting up. Visitors will see a "Coming Soon" 
                      page instead of your store. Only administrators can access the store.
                    </p>
                    <div className="mt-3 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-yellow-600 font-medium">Ideal for store setup or maintenance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            {selectedMode === 'coming-soon' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                    <p className="mt-1 text-sm text-yellow-700">
                      When you set your store to "Coming Soon" mode, all public access will be restricted. 
                      Existing customers won't be able to place orders or access their accounts from the frontend.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">What happens in each mode?</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Eye className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Live Mode:</span> Full store functionality, 
                    public access, SEO indexing enabled, all features available.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900">Coming Soon Mode:</span> Public access blocked, 
                    admin access only, SEO indexing disabled, maintenance-friendly.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {visibility?.mode !== selectedMode ? (
                <span className="text-orange-600 font-medium">You have unsaved changes</span>
              ) : (
                <span>Current setting: {visibility?.mode || 'live'}</span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={btnLoading || visibility?.mode === selectedMode}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {btnLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}