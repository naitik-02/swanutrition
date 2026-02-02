"use client"

import React, { useState, useEffect } from 'react';
import { usePaymentSettingsContext } from '@/context/storePayment';
import { Save, CreditCard, Truck, FileText, Building, Plus, Trash2 } from 'lucide-react';

const PaymentSettingsPage = () => {
  const { 
    paymentSettings, 
    loading, 
    btnLoading, 
    updatePaymentSettings 
  } = usePaymentSettingsContext();

  const [formData, setFormData] = useState({
    cod: {
      enabled: false,
      title: 'Cash on Delivery',
      description: 'Pay with cash upon delivery.',
      instructions: 'Pay with cash when the order arrives at your doorstep.'
    },
    check: {
      enabled: false,
      title: 'Check Payments',
      description: 'Send a check to our store address.',
      instructions: 'Please send a check to our store address. Your order will be processed once the payment is received.'
    },
    bankTransfer: {
      enabled: false,
      title: 'Direct Bank Transfer',
      description: 'Make your payment directly into our bank account.',
      instructions: 'Please use your Order ID as the payment reference. Your order will be processed once the payment is confirmed.',
      accountDetails: []
    }
  });

  useEffect(() => {
    if (paymentSettings) {
      setFormData({
        cod: {
          enabled: paymentSettings.cod?.enabled || false,
          title: paymentSettings.cod?.title || 'Cash on Delivery',
          description: paymentSettings.cod?.description || 'Pay with cash upon delivery.',
          instructions: paymentSettings.cod?.instructions || 'Pay with cash when the order arrives at your doorstep.'
        },
        check: {
          enabled: paymentSettings.check?.enabled || false,
          title: paymentSettings.check?.title || 'Check Payments',
          description: paymentSettings.check?.description || 'Send a check to our store address.',
          instructions: paymentSettings.check?.instructions || 'Please send a check to our store address. Your order will be processed once the payment is received.'
        },
        bankTransfer: {
          enabled: paymentSettings.bankTransfer?.enabled || false,
          title: paymentSettings.bankTransfer?.title || 'Direct Bank Transfer',
          description: paymentSettings.bankTransfer?.description || 'Make your payment directly into our bank account.',
          instructions: paymentSettings.bankTransfer?.instructions || 'Please use your Order ID as the payment reference. Your order will be processed once the payment is confirmed.',
          accountDetails: paymentSettings.bankTransfer?.accountDetails || []
        }
      });
    }
  }, [paymentSettings]);

  const handlePaymentMethodChange = (method, field, value) => {
    setFormData(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }));
  };

  const addBankAccount = () => {
    const newAccount = {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifsc: '',
      iban: '',
      bicSwift: ''
    };
    
    setFormData(prev => ({
      ...prev,
      bankTransfer: {
        ...prev.bankTransfer,
        accountDetails: [...prev.bankTransfer.accountDetails, newAccount]
      }
    }));
  };

  const removeBankAccount = (index) => {
    setFormData(prev => ({
      ...prev,
      bankTransfer: {
        ...prev.bankTransfer,
        accountDetails: prev.bankTransfer.accountDetails.filter((_, i) => i !== index)
      }
    }));
  };

  const handleBankAccountChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      bankTransfer: {
        ...prev.bankTransfer,
        accountDetails: prev.bankTransfer.accountDetails.map((account, i) => 
          i === index ? { ...account, [field]: value } : account
        )
      }
    }));
  };

  const handleSubmit = async () => {
    await updatePaymentSettings(formData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const PaymentMethodCard = ({ method, icon: Icon, title, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`${method}-enabled`}
            checked={formData[method].enabled}
            onChange={(e) => handlePaymentMethodChange(method, 'enabled', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={`${method}-enabled`} className="ml-2 text-sm text-gray-700">
            Enable
          </label>
        </div>
      </div>
      
      {formData[method].enabled && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Payment Settings</h1>
        <p className="text-gray-600 mt-1">Configure available payment methods for your customers</p>
      </div>

      <div className="space-y-6">
        {/* Cash on Delivery */}
        <PaymentMethodCard method="cod" icon={Truck} title="Cash on Delivery">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.cod.title}
                onChange={(e) => handlePaymentMethodChange('cod', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cash on Delivery"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.cod.description}
                onChange={(e) => handlePaymentMethodChange('cod', 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Pay with cash upon delivery."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                rows={3}
                value={formData.cod.instructions}
                onChange={(e) => handlePaymentMethodChange('cod', 'instructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Pay with cash when the order arrives at your doorstep."
              />
            </div>
          </div>
        </PaymentMethodCard>

        {/* Check Payments */}
        <PaymentMethodCard method="check" icon={FileText} title="Check Payments">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.check.title}
                onChange={(e) => handlePaymentMethodChange('check', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Check Payments"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.check.description}
                onChange={(e) => handlePaymentMethodChange('check', 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Send a check to our store address."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                rows={3}
                value={formData.check.instructions}
                onChange={(e) => handlePaymentMethodChange('check', 'instructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please send a check to our store address. Your order will be processed once the payment is received."
              />
            </div>
          </div>
        </PaymentMethodCard>

        {/* Bank Transfer */}
        <PaymentMethodCard method="bankTransfer" icon={Building} title="Direct Bank Transfer">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.bankTransfer.title}
                onChange={(e) => handlePaymentMethodChange('bankTransfer', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Direct Bank Transfer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.bankTransfer.description}
                onChange={(e) => handlePaymentMethodChange('bankTransfer', 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Make your payment directly into our bank account."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                rows={3}
                value={formData.bankTransfer.instructions}
                onChange={(e) => handlePaymentMethodChange('bankTransfer', 'instructions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please use your Order ID as the payment reference. Your order will be processed once the payment is confirmed."
              />
            </div>

            {/* Bank Account Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Bank Account Details</h4>
                <button
                  type="button"
                  onClick={addBankAccount}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4" />
                  Add Account
                </button>
              </div>

              {formData.bankTransfer.accountDetails.map((account, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-gray-700">Account {index + 1}</h5>
                    <button
                      type="button"
                      onClick={() => removeBankAccount(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={account.accountName || ''}
                        onChange={(e) => handleBankAccountChange(index, 'accountName', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Account holder name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={account.accountNumber || ''}
                        onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Account number"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={account.bankName || ''}
                        onChange={(e) => handleBankAccountChange(index, 'bankName', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Bank name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={account.ifsc || ''}
                        onChange={(e) => handleBankAccountChange(index, 'ifsc', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="IFSC code"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        IBAN
                      </label>
                      <input
                        type="text"
                        value={account.iban || ''}
                        onChange={(e) => handleBankAccountChange(index, 'iban', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="IBAN (if applicable)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        BIC/SWIFT
                      </label>
                      <input
                        type="text"
                        value={account.bicSwift || ''}
                        onChange={(e) => handleBankAccountChange(index, 'bicSwift', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="BIC/SWIFT code"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.bankTransfer.accountDetails.length === 0 && (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-md">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No bank accounts added yet</p>
                  <p className="text-xs">Click "Add Account" to add your bank details</p>
                </div>
              )}
            </div>
          </div>
        </PaymentMethodCard>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
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
            {btnLoading ? 'Saving...' : 'Save Payment Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettingsPage;