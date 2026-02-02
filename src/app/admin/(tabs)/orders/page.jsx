"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Phone,
  Calendar,
  MapPin,
  User,
  Mail,
  Clock,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Truck,
  X,
  Check,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useOrder } from "@/context/order";
import Loading from "@/components/loading";

const OrdersTable = () => {
  const generateWhatsAppMessage = (order) => {
    const message = `🛍️ *Order Details*

📦 Order ID: #${order._id.slice(-8)}
👤 Customer: ${order.userId?.name || "N/A"}
📱 Phone: ${order.address?.phone || "N/A"}

📊 Status: ${order.orderStatus.toUpperCase()}
💳 Payment: ${order.paymentStatus.toUpperCase()} via ${order.paymentMethod}
💰 Total Amount: ₹${order.totalAmount}

📦 Items (${order.totalItems}):
${
  order.items
    ?.map(
      (item, index) =>
        `${index + 1}. ${item.productId?.title || "Product"} - ${
          item.quantity
        } x ₹${item.finalPrice}`,
    )
    .join("\n") || "No items"
}
 Delivery Address:
${
  order.address
    ? `${order.address.name}
${order.address.floor}, ${order.address.flat}
${order.address.addressLine}
${order.address.landmark}`
    : "Address not available"
}

📅 Order Date: ${formatDate(order.createdAt)}`;

    return message;
  };
  const {
    fetchOrdersBySeller,
    sellerOrders,
    loading,
    error,
    updateSellerOrderStatus,
    updateOrderStatus
  } = useOrder();

  const [searchTerm, setSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchOrdersBySeller({
        status: orderStatusFilter || undefined,
        page: currentPage,
        limit: ordersPerPage,
      });
      if (result?.pagination) {
        setPagination(result.pagination);
      }
    };
    fetchData();
  }, [orderStatusFilter, currentPage, ordersPerPage]);

  const filteredOrders =
    sellerOrders?.filter((order) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        order.userId?.name?.toLowerCase().includes(searchLower) ||
        order.userId?.email?.toLowerCase().includes(searchLower) ||
        order._id.includes(searchTerm)
      );
    }) || [];

  const finalFilteredOrders = filteredOrders.filter((order) => {
    const paymentStatusMatch =
      !paymentStatusFilter || order.paymentStatus === paymentStatusFilter;
    return paymentStatusMatch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    setBtnLoading(true);
    try {
      setTimeout(() => {
        updateOrderStatus(orderId, newStatus);
        setBtnLoading(false);

        fetchOrdersBySeller({
          status: orderStatusFilter || undefined,
          page: currentPage,
          limit: ordersPerPage,
        });

        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({
            ...prev,
            orderStatus: newStatus,
            updatedAt: new Date().toISOString(),
          }));
        }
      }, 1000);
    } catch (error) {
      setBtnLoading(false);
      console.error("Failed to update order status:", error);
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";

      case "confirmed":
        return "bg-blue-100 text-blue-800";

      case "packed":
        return "bg-indigo-100 text-indigo-800";

      case "shipped":
        return "bg-purple-100 text-purple-800";

      case "out_for_delivery":
        return "bg-orange-100 text-orange-800";

      case "delivered":
        return "bg-green-100 text-green-800";

      case "cancelled":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;

      case "confirmed":
        return <CheckCircle className="w-3 h-3" />;

      case "packed":
        return <Package className="w-3 h-3" />;

      case "shipped":
        return <Truck className="w-3 h-3" />;

      case "out_for_delivery":
        return <MapPin className="w-3 h-3" />;

      case "delivered":
        return <PackageCheck className="w-3 h-3" />;

      case "cancelled":
        return <XCircle className="w-3 h-3" />;

      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleWhatsAppShare = (order) => {
    const phone = order.address?.phone;

    if (!phone) {
      alert("Customer phone number not available");
      return;
    }

    const cleanPhone = phone.replace(/[^\d]/g, "");
    console.log("Clean phone:", cleanPhone);

    // Check if phone has country code
    let finalPhone = cleanPhone;
    if (cleanPhone.length === 10) {
      finalPhone = "91" + cleanPhone; // Add India country code
    }

    const url = `https://wa.me/${finalPhone}`;

    window.open(url, "_blank");
  };

  if (loading && !sellerOrders?.length) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Orders Management
            </h1>
            <p className="text-gray-600">
              Manage customer orders, payments, and delivery status
            </p>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => {
                  setOrderStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Order Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>

              <div className="text-sm text-gray-600">
                Total: {pagination.total || 0} orders
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Main Orders Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              All Orders
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Info
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {finalFilteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {loading ? "Loading orders..." : "No orders found"}
                    </td>
                  </tr>
                ) : (
                  finalFilteredOrders.map((order, index) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              #{index + 1}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.totalItems} items
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {order.userId?.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                       <div className="grid grid-cols-2 gap-1 mt-1">
  {order.orderStatus === "pending" && (
    <>
      <button
        onClick={() => handleOrderStatusChange(order._id, "confirmed")}
        disabled={btnLoading}
        className="text-[10px] px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Confirm
      </button>

      <button
        onClick={() => handleOrderStatusChange(order._id, "cancelled")}
        disabled={btnLoading}
        className="text-[10px] px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
      >
        Cancel
      </button>
    </>
  )}

  {order.orderStatus === "confirmed" && (
    <>
      <button
        onClick={() => handleOrderStatusChange(order._id, "packed")}
        disabled={btnLoading}
        className="text-[10px] px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        Pack
      </button>

      <button
        onClick={() => handleOrderStatusChange(order._id, "cancelled")}
        disabled={btnLoading}
        className="text-[10px] px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
      >
        Cancel
      </button>
    </>
  )}

  {order.orderStatus === "packed" && (
    <>
      <button
        onClick={() => handleOrderStatusChange(order._id, "shipped")}
        disabled={btnLoading}
        className="text-[10px] px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
      >
        Ship
      </button>

      <button
        onClick={() => handleOrderStatusChange(order._id, "cancelled")}
        disabled={btnLoading}
        className="text-[10px] px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
      >
        Cancel
      </button>
    </>
  )}

  {order.orderStatus === "shipped" && (
    <>
      <button
        onClick={() => handleOrderStatusChange(order._id, "out_for_delivery")}
        disabled={btnLoading}
        className="text-[10px] px-2 py-1 rounded bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 col-span-2"
      >
        Out for Delivery
      </button>
    </>
  )}

  {order.orderStatus === "out_for_delivery" && (
    <>
      <button
        onClick={() => handleOrderStatusChange(order._id, "delivered")}
        disabled={btnLoading}
        className="text-[10px] px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 col-span-2"
      >
        Deliver
      </button>
    </>
  )}
</div>

                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {order.paymentMethod}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(
                            order.paymentStatus,
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm font-bold text-gray-900">
                          ₹{order.totalAmount}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(order)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {currentPage} of {pagination.totalPages} (
                  {pagination.total} total orders)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || loading}
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let page;
                      if (pagination.totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        page = pagination.totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          disabled={loading}
                          className={`px-3 py-1 border rounded-md text-sm ${
                            currentPage === page
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(pagination.totalPages, currentPage + 1),
                      )
                    }
                    disabled={currentPage === pagination.totalPages || loading}
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* WhatsApp Share Button - Sticky */}
              <button
                onClick={() => handleWhatsAppShare(selectedOrder)}
                className="fixed right-6 top-20 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-60"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details - #{selectedOrder._id.slice(-8)}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Order Status
                    </h4>
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full ${getOrderStatusColor(
                          selectedOrder.orderStatus,
                        )}`}
                      >
                        {getOrderStatusIcon(selectedOrder.orderStatus)}
                        {selectedOrder.orderStatus}
                      </span>
                      {selectedOrder.orderStatus === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              handleOrderStatusChange(
                                selectedOrder._id,
                                "delivered",
                              );
                            }}
                            disabled={btnLoading}
                            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {btnLoading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : null}
                            Mark as Delivered
                          </button>
                          <button
                            onClick={() => {
                              handleOrderStatusChange(
                                selectedOrder._id,
                                "cancelled",
                              );
                            }}
                            disabled={btnLoading}
                            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium">
                          {selectedOrder.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                            selectedOrder.paymentStatus,
                          )}`}
                        >
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-lg">
                          ₹{selectedOrder.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Timeline
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">
                          {formatDate(selectedOrder.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Updated:</span>
                        <span className="font-medium">
                          {formatDate(selectedOrder.updatedAt)}
                        </span>
                      </div>
                      {selectedOrder.deliveredAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivered:</span>
                          <span className="font-medium">
                            {formatDate(selectedOrder.deliveredAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">phone:</span>
                        <span className="font-medium">
                          {selectedOrder.userId?.phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h4>

                    {selectedOrder.address ? (
                      <div className="space-y-1 text-sm text-gray-700">
                        <div>
                          <span className="font-medium">Name:</span>{" "}
                          {selectedOrder.address.name}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span>{" "}
                          {selectedOrder.address.phone}
                        </div>
                        <div>
                          <span className="font-medium">Floor:</span>{" "}
                          {selectedOrder.address.floor}
                        </div>
                        <div>
                          <span className="font-medium">Flat:</span>{" "}
                          {selectedOrder.address.flat}
                        </div>
                        <div>
                          <span className="font-medium">Address Line:</span>{" "}
                          {selectedOrder.address.addressLine}
                        </div>
                        <div>
                          <span className="font-medium">Landmark:</span>{" "}
                          {selectedOrder.address.landmark}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Address information not available
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order Items ({selectedOrder.totalItems} items)
                  </h4>

                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-gray-200 flex gap-3"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={
                              typeof item.productId === "object"
                                ? item.productId?.images[0] ||
                                  "/placeholder.png"
                                : "/placeholder.png"
                            }
                            alt={item.productId?.title || "Product"}
                            className="w-full h-full object-cover rounded-md border"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.productId?.title ||
                                  `Product ${item.productId}`}
                              </div>
                              <div className="text-sm text-gray-600">
                                Product ID: #
                                {typeof item.productId === "string"
                                  ? item.productId.slice(-6)
                                  : item.productId?._id?.slice(-6)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {item.unit} × {item.quantity} units
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-bold text-gray-900">
                                ₹{item.finalPrice * item.quantity}
                              </div>
                              {item.price !== item.finalPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  ₹{item.price * item.quantity}
                                </div>
                              )}
                              <div className="text-sm text-gray-600">
                                ₹{item.finalPrice} per unit
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Order Total */}
                    <div className="border-t border-gray-200 pt-3 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Order Total:
                        </span>
                        <span className="text-xl font-bold text-gray-900">
                          ₹{selectedOrder.totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const message = generateWhatsAppMessage(selectedOrder);
                      navigator.clipboard
                        .writeText(message)
                        .then(() => {
                          alert(
                            "✅ Order details copied to clipboard!\n\nNow open WhatsApp and paste the message.",
                          );
                        })
                        .catch(() => {
                          alert("❌ Could not copy. Please try again.");
                        });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    📋 Copy Message
                  </button>

                  <button
                    onClick={() => handleWhatsAppShare(selectedOrder)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Open WhatsApp
                  </button>
                </div>

                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
