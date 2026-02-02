"use client";
import Loading from '@/components/loading';
import { AlertTriangle, User, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AccountDeletionPage = () => {
  const [showDeleteOptions, setShowDeleteOptions] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [showFinalStep, setShowFinalStep] = useState(false);
  const [feedback, setFeedback] = useState('');

  const deleteReasons = [
    'Too expensive',
    'Poor delivery service', 
    'Limited product selection',
    'Found better alternative',
    'Privacy concerns',
    'Technical issues',
    'Other'
  ];

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
    setShowFinalStep(true);
  };


  const handleFinalDelete = () => {
    
    alert('Account deletion request submitted. You will receive a confirmation email shortly.');
    
  };

  const resetFlow = () => {
    setShowDeleteOptions(false);
    setSelectedReason('');
    setShowFinalStep(false);
    setFeedback('');
  };



  return (
    <div className="   ">
      <div className=" mx-auto">
        <div className="bg-white rounded-lg shadow-md ">
         
          <div className="flex items-center p-2 gap-3 mb-2">
            <User className="h-8 w-8 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          </div>

          {!showDeleteOptions && !showFinalStep && (
            <>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold pl-4 text-gray-800 mb-4">Account Deletion Terms</h2>
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-2">
                  <p>• Once you delete your account, all your data will be permanently removed</p>
                  <p>• Your order history, preferences, and saved items will be lost</p>
                  <p>• This action cannot be undone</p>
                  <p>• You will receive a confirmation email before final deletion</p>
                  <p>• The deletion process may take up to 30 days to complete</p>
                </div>
              </div>

              {/* Delete Account Section */}
              <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Delete Account</h3>
                    <p className="text-red-700 text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowDeleteOptions(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete My Account
                </button>
              </div>
            </>
          )}

          {/* Delete Reason Selection */}
          {showDeleteOptions && !showFinalStep && (
            <div>
              <div className="mb-6">
                <button
                  onClick={resetFlow}
                  className="text-blue-600 hover:text-blue-800 text-sm mb-4"
                >
                  ← Back to Account Settings
                </button>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Why are you leaving?</h2>
                <p className="text-gray-600 text-sm">Help us improve by telling us why you're deleting your account</p>
              </div>

              <div className="space-y-3">
                {deleteReasons.map((reason, index) => (
                  <button
                    key={index}
                    onClick={() => handleReasonSelect(reason)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-gray-700">{reason}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Final Step with Optional Feedback */}
          {showFinalStep && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setShowFinalStep(false)}
                  className="text-blue-600 hover:text-blue-800 text-sm mb-4"
                >
                  ← Back to Reasons
                </button>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Final Step</h2>
                <p className="text-gray-600 text-sm">Selected reason: <span className="font-medium">{selectedReason}</span></p>
              </div>

              {/* Optional Feedback */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional feedback (optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more about your experience or suggestions for improvement..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>

              {/* Final Confirmation */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium mb-1">This action is irreversible</p>
                    <p>Your account and all associated data will be permanently deleted.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetFlow}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalDelete}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Account Forever
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDeletionPage;