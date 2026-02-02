"use client";
import React, { useEffect, useState } from "react";
import { Store } from "lucide-react";
import { useSeller } from "@/context/seller";
import { useUser } from "@/context/user";

const SelectShop = ({ selectedAddress , selectedSeller , setSelectedSeller }) => {

  const { fetchNearbySellers, nearbySellers, loading } = useSeller();
  const {isAuth} = useUser()

  useEffect(() => {
    if (selectedAddress?.location?.coordinates && isAuth) {
      fetchNearbySellers({
        latitude: selectedAddress.location.coordinates[1], 
        longitude: selectedAddress.location.coordinates[0], 
      });
    }
  }, [selectedAddress]);



  return (
    <div className="">
      <div className="relative w-full">
        <select
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block px-4 py-2 pr-10 transition-all"
        >
          <option value="">Select a shop</option>
          {loading && <option disabled>Loading nearby shops...</option>}
          {!loading && nearbySellers?.length === 0 && (
            <option disabled>No nearby shops found</option>
          )}
          {nearbySellers?.length > 0 &&
            nearbySellers.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.storeName}
              </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
        
        </div>
      </div>
    </div>
  );
};

export default SelectShop;