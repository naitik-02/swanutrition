"use client";
import AddAddress from "@/components/(user)/AddAddress";
import Loading from "@/components/loading";
import { useAddressContext } from "@/context/address";
import { useCart } from "@/context/cart";
import { Edit, Plus, Trash2, User, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddressesPage = () => {
  const {
    addresses,
    setDefaultAddress,
    addAddress,
    updateAddress,
    setAddresses,
    deleteAddress,
    fetchAddresses,
    loading,
  } = useAddressContext();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem("user_myAddresses");
    if (cached) {
      setAddresses(JSON.parse(cached));
    } else {
      fetchAddresses();
    }
  }, []);

  const [formData, setFormData] = useState({
    type: "Home",
    name: "",
    phone: "",
    floor: "",
    flat: "",
    addressLine: "",
    landmark: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    isDefault: false,
  });

  const handleDeleteAddress = (id) => {
    deleteAddress(id);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddressModal(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setFormData({
      type: "Home",
      name: "",
      phone: "",
      floor: "",
      flat: "",
      addressLine: "",
      landmark: "",
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      isDefault: false,
    });
    setShowAddressModal(true);
  };

  const setAsDefault = (id) => {
    setDefaultAddress(id);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="">
      <div className="flex justify-between pb-2 items-center">
        <button
          onClick={handleAddNewAddress}
          className="flex items-center gap-2 text-xs  bg-green-500 hover:bg-green-600 text-white  px-4 py-2 rounded-lg  transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address._id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                    {address.type}
                  </span>
                  {address.isDefault && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-800 font-medium mb-1">
                  {address.addressLine}
                </p>
                <p className="text-gray-600 text-sm mb-2">{address.landmark}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {address.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {address.phone}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => setAsDefault(address._id)}
                    className="px-3 py-1 text-xs text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleEditAddress(address)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAddress(address._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddressModal && (
        <AddAddress
          addAddress={addAddress}
          updateAddress={updateAddress}
          editingAddress={editingAddress}
          addresses={addresses}
          setShowAddressModal={setShowAddressModal}
        />
      )}
    </div>
  );
};

export default AddressesPage;
