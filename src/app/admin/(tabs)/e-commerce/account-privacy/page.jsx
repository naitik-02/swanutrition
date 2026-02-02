"use client"

import React, { useState, useEffect } from 'react';
import { Save, Shield, Users, FileText, Trash2 } from 'lucide-react';
import { useAccountPrivacyContext } from '@/context/accountandprivacy'; // Update this import path

export default function AccountPrivacySettings() {
  const { accountPrivacy, loading, btnLoading, saveAccountPrivacy , fetchAccountPrivacy } = useAccountPrivacyContext();


  useEffect(() => {
    fetchAccountPrivacy();
  }, []);



  const [formData, setFormData] = useState({
    guestCheckout: true,
    enableLoginDuringCheckout: false,
    allowAccountCreation: {
      duringCheckout: false,
      onMyAccountPage: false,
    },
    sendPasswordLink: true,
    accountErasureRequests: {
      removePersonalData: false,
      removeDownloadAccess: false,
      allowBulkRemoval: false,
    },
    registrationPrivacyPolicy: "",
    checkoutPrivacyPolicy: "",
  });

  useEffect(() => {
    if (accountPrivacy) {
      setFormData(accountPrivacy);
    }
  }, [accountPrivacy]);

  const handleToggle = (path, value) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      
      if (keys.length === 1) {
        // Direct property
        newData[keys[0]] = value;
      } else if (keys.length === 2) {
        // Nested property
        if (!newData[keys[0]]) {
          newData[keys[0]] = {};
        } else {
          newData[keys[0]] = { ...newData[keys[0]] };
        }
        newData[keys[0]][keys[1]] = value;
      }
      
      return newData;
    });
  };

  const handleTextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    saveAccountPrivacy(formData);
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
            <Shield className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">Account Privacy Settings</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Configure privacy and data protection settings for customer accounts and checkout processes.
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Guest Checkout Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Guest Checkout Options</h2>
            </div>
            
            <div className="pl-8 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow guest checkout</label>
                  <p className="text-xs text-gray-500 mt-1">Enable customers to checkout without creating an account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData?.guestCheckout === true}
                    onChange={(e) => handleToggle('guestCheckout', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable login during checkout</label>
                  <p className="text-xs text-gray-500 mt-1">Allow existing customers to log in during the checkout process</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData?.enableLoginDuringCheckout === true}
                    onChange={(e) => handleToggle('enableLoginDuringCheckout', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Creation Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Account Creation</h2>
            
            <div className="pl-4 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow account creation during checkout</label>
                  <p className="text-xs text-gray-500 mt-1">Enable new customers to create accounts during checkout</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData?.allowAccountCreation?.duringCheckout === true}
                    onChange={(e) => handleToggle('allowAccountCreation.duringCheckout', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow account creation on "My Account" page</label>
                  <p className="text-xs text-gray-500 mt-1">Enable registration directly from the My Account page</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData?.allowAccountCreation?.onMyAccountPage === true}
                    onChange={(e) => handleToggle('allowAccountCreation.onMyAccountPage', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">Send password setup link</label>
                  <p className="text-xs text-gray-500 mt-1">Send new users a link to set up their password</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData?.sendPasswordLink || false}
                    onChange={(e) => handleToggle('sendPasswordLink', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Erasure Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Trash2 className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-medium text-gray-900">Account Erasure Requests</h2>
            </div>
            
            <div className="pl-8 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">Remove personal data</label>
                  <p className="text-xs text-gray-500 mt-1">Allow removal of personal data on erasure requests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData?.accountErasureRequests?.removePersonalData || false}
                    onChange={(e) => handleToggle('accountErasureRequests.removePersonalData', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">Remove download access</label>
                  <p className="text-xs text-gray-500 mt-1">Remove access to downloadable products on erasure requests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData?.accountErasureRequests?.removeDownloadAccess || false}
                    onChange={(e) => handleToggle('accountErasureRequests.removeDownloadAccess', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow bulk removal</label>
                  <p className="text-xs text-gray-500 mt-1">Enable bulk processing of erasure requests</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData?.accountErasureRequests?.allowBulkRemoval || false}
                    onChange={(e) => handleToggle('accountErasureRequests.allowBulkRemoval', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Policy Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Privacy Policy Content</h2>
            </div>
            
            <div className="pl-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration privacy policy
                </label>
                <textarea
                  value={formData?.registrationPrivacyPolicy || ''}
                  onChange={(e) => handleTextChange('registrationPrivacyPolicy', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter privacy policy content for registration..."
                />
                <p className="text-xs text-gray-500 mt-1">Privacy policy text displayed during account registration</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checkout privacy policy
                </label>
                <textarea
                  value={formData?.checkoutPrivacyPolicy || ''}
                  onChange={(e) => handleTextChange('checkoutPrivacyPolicy', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter privacy policy content for checkout..."
                />
                <p className="text-xs text-gray-500 mt-1">Privacy policy text displayed during checkout process</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Changes will affect new customer registrations and checkout processes.
            </p>
            <button
              onClick={handleSave}
              disabled={btnLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {btnLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
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