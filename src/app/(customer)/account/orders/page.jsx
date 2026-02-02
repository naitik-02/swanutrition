"use client";
import Loading from "@/components/loading";
import { useOrder } from "@/context/order";
import {
  Package,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Truck,
  ShoppingBag,
  ChevronRight as ArrowRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const { fetchMyOrders, myOrders, loading } = useOrder();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchMyOrders(currentPage);
  }, [currentPage]);


  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
      case "Out for Delivery":
        return <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
      case "Delivered":
        return <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
      case "Cancelled":
        return <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
      default:
        return <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Out for Delivery":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="  ">

      <div className="mx-auto">

        {myOrders?.orders?.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-16 text-center">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myOrders?.orders?.map((order) => {
              const displayItems = order.items?.slice(0, 3) || [];
              const remainingCount = (order.items?.length || 0) - 3;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex gap-3">
                    <div className="w-24 flex-shrink-0">
                      <div className="grid grid-cols-2 gap-1">
                        {displayItems.map((item, idx) => (
                          <div
                            key={idx}
                            className={`${
                              idx === 0 && order.items?.length === 1
                                ? "col-span-2 row-span-2"
                                : idx === 0 && order.items?.length === 2
                                ? "col-span-2"
                                : ""
                            } aspect-square rounded-md border border-gray-200 overflow-hidden bg-gray-50`}
                          >
                            <img
                              src={
                                item.productId?.images?.[0] || "/placeholder.png"
                              }
                              alt={item.productId?.title || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        
                        {remainingCount > 0 && (
                          <div className="aspect-square rounded-md border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-bold text-gray-700">
                              +{remainingCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {order.category || "Groceries"}
                          </h3>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {order.items?.length}{" "}
                            {order.items?.length === 1 ? "item" : "items"}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap flex-shrink-0 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          <span>{order.orderStatus}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            ₹{order.totalAmount?.toFixed(2)}
                          </p>
                        </div>
                        <button
                          className="flex cursor-pointer items-center gap-1 text-blue-600 text-xs font-medium hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/order-detail/${order._id}`);
                          }}
                        >
                          View Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {myOrders?.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Previous</span>
              <span className="xs:hidden">Prev</span>
            </button>

            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              {currentPage} / {myOrders.totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, myOrders.totalPages)
                )
              }
              disabled={currentPage === myOrders.totalPages}
              className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium ${
                currentPage === myOrders.totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="xs:hidden">Next</span>
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;