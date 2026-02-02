"use client"

import React, { useState, useEffect } from 'react';
import { useStoreSettings } from '@/context/storeSetting';
import { Save, MapPin, Globe, Truck, DollarSign } from 'lucide-react';

const StoreSettingsPage = () => {
  const { 
    storeSettings, 
    loading, 
    btnLoading, 
    saveStoreSettings ,
    fetchStoreSettings
  } = useStoreSettings();






    useEffect(() => {
    fetchStoreSettings();
  }, []);


  const [formData, setFormData] = useState({
    storeAddress: {
      addressLine1: '',
      city: '',
      postcode: '',
      country: '',
      state: ''
    },
    sellingCountries: [],
    shippingEnabled: true,
    currency: 'INR',
    currencyPosition: 'left',
    numberOfDecimals: 2
  });

  const [newCountry, setNewCountry] = useState('');

  // Popular countries list for dropdown
  const popularCountries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Japan',
    'South Korea', 'Singapore', 'UAE', 'Saudi Arabia'
  ];

  const currencies = [
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'AED', name: 'UAE Dirham (د.إ)' },
    { code: 'SAR', name: 'Saudi Riyal (﷼)' }
  ];



  useEffect(() => {
    if (storeSettings) {
      setFormData({
        storeAddress: {
          addressLine1: storeSettings.storeAddress?.addressLine1 || '',
          city: storeSettings.storeAddress?.city || '',
          postcode: storeSettings.storeAddress?.postcode || '',
          country: storeSettings.storeAddress?.country || '',
          state: storeSettings.storeAddress?.state || ''
        },
        sellingCountries: storeSettings.sellingCountries || [],
        shippingEnabled: storeSettings.shippingEnabled ?? true,
        currency: storeSettings.currency || 'INR',
        currencyPosition: storeSettings.currencyPosition || 'left',
        numberOfDecimals: storeSettings.numberOfDecimals ?? 2
      });
    }
  }, [storeSettings]);

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      storeAddress: {
        ...prev.storeAddress,
        [field]: value
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCountry = () => {
    if (newCountry.trim() && !formData.sellingCountries.includes(newCountry.trim())) {
      setFormData(prev => ({
        ...prev,
        sellingCountries: [...prev.sellingCountries, newCountry.trim()]
      }));
      setNewCountry('');
    }
  };

  const removeCountry = (countryToRemove) => {
    setFormData(prev => ({
      ...prev,
      sellingCountries: prev.sellingCountries.filter(country => country !== countryToRemove)
    }));
  };

  const handleSubmit = async () => {
    await saveStoreSettings(formData);
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
          <h1 className="text-2xl font-semibold text-gray-900">Store Settings</h1>
          <p className="text-gray-600 mt-1">Manage your store configuration and preferences</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Store Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-medium text-gray-900">Store Address</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.storeAddress.addressLine1}
                  onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your store address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.storeAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.storeAddress.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="State"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={formData.storeAddress.postcode}
                  onChange={(e) => handleAddressChange('postcode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Postal code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.storeAddress.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Selling Countries Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-medium text-gray-900">Selling Countries</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a country</option>
                  {popularCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  placeholder="Or type country name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addCountry}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
              
              {formData.sellingCountries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.sellingCountries.map((country, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {country}
                      <button
                        type="button"
                        onClick={() => removeCountry(country)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Shipping Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-medium text-gray-900">Shipping Settings</h2>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="shippingEnabled"
                checked={formData.shippingEnabled}
                onChange={(e) => handleInputChange('shippingEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="shippingEnabled" className="ml-2 text-sm text-gray-700">
                Enable shipping for this store
              </label>
            </div>
          </div>

          {/* Currency Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-medium text-gray-900">Currency Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Position
                </label>
                <select
                  value={formData.currencyPosition}
                  onChange={(e) => handleInputChange('currencyPosition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="left">Left (₹100)</option>
                  <option value="right">Right (100₹)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Decimals
                </label>
                <select
                  value={formData.numberOfDecimals}
                  onChange={(e) => handleInputChange('numberOfDecimals', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>0 (100)</option>
                  <option value={1}>1 (100.0)</option>
                  <option value={2}>2 (100.00)</option>
                  <option value={3}>3 (100.000)</option>
                </select>
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

export default StoreSettingsPage;