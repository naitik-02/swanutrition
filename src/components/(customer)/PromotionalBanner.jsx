import React from 'react';
import { Truck, Gift, Percent, Bell } from 'lucide-react';

const PromotionalBanner = () => {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-100 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6  lg:mx-20 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Percent className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Buy 1, Get 1 at 50% Off
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Plus free shipping on orders over ₹599
                  <span className="block text-xs text-gray-500 mt-1">(excludes drink cases)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Free & Fast Delivery
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get your orders delivered at your doorstep
                  <span className="block text-xs text-gray-500 mt-1">within 3-5 business days</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Subscribe & Save
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get free shipping, bonus rewards, and 10% off
                  <span className="block text-xs text-gray-500 mt-1">with Subscribe To Save program</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Limited time offer • Terms & conditions apply
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;