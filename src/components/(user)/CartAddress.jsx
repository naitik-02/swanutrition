"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Edit, Plus, Check } from "lucide-react";
import AddAddress from "./AddAddress";


const CartAddress = ({ addresses, addAddress, updateAddress , selectedAddress , setSelectedAddress }) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressModalone, setShowAddressModalone] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

 

  const [formData, setFormData] = useState({
    type: "Home",
    name: "",
    phone: "",
    building: "",
    
    area: "",
    landmark: "",
    city: "",
    pincode: "",
    coordinates: null,
  });

  const handleEditAddress = (e, address) => {
    e.stopPropagation();
    setEditingAddress(address);
    setFormData(address);
    setShowAddressModal(true);
    setShowAddressModalone(false);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setFormData({
      type: "Home",
      name: "",
      phone: "",
      building: "",
    
      area: "",
      landmark: "",
      city: "",
      pincode: "",
      coordinates: null,
    });
    setShowAddressModal(true);
    setShowAddressModalone(false);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressModalone(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Delivery Address
            </h3>
          </div>
          <button
            onClick={() => setShowAddressModalone(true)}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
          >
            Change
          </button>
        </div>

        {/* Selected Address Card */}
        <div className="bg-gradient-to-r from-orange-50 to-green-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {selectedAddress?.type}
                </span>
                {selectedAddress?.isDefault && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Check size={12} />
                    Default
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-gray-900">
                  {selectedAddress?.name}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedAddress?.addressLine}
                </p>
                <p className="text-gray-600 text-sm">
                  {selectedAddress?.landmark}
                </p>
                <p className="text-gray-600 text-sm">
                  📞 {selectedAddress?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      {showAddressModalone && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Select Delivery Address
                </h3>
                <button
                  onClick={() => setShowAddressModalone(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedAddress._id === address._id
                        ? "border-orange-300 bg-orange-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelectAddress(address)}
                  >
                    {/* Selection Indicator */}
                    {selectedAddress._id === address._id && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1">
                        <Check size={16} />
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Check size={12} />
                              Default
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">
                            {address.name}
                          </p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {address.addressLine}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {address.landmark}
                          </p>
                          <p className="text-gray-600 text-sm">
                            📞 {address.phone}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleEditAddress(e, address)}
                        className="ml-4 p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        title="Edit address"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Address Button */}
              <button
                onClick={handleAddNewAddress}
                className="w-full mt-6 border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add New Address
              </button>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddressModalone(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddressModalone(false)}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-green-600 text-white rounded-lg font-medium hover:from-orange-700 hover:to-green-700 transition-all duration-200"
                >
                  Confirm Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {showAddressModal && (
        <AddAddress
          addAddress={addAddress}
          updateAddress={updateAddress}
          editingAddress={editingAddress}
          addresses={addresses}
          setShowAddressModal={setShowAddressModal}
        />
      )}
    </>
  );
};

export default CartAddress;
