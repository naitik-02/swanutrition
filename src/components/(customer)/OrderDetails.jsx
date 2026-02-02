"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  Printer,
  Download,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import { useOrder } from "@/context/order";
import { useComplaintContext } from "@/context/complaint";
import Loading from "@/components/loading";
import Link from "next/link";

const OrderDetails = ({id}) => {
  const router = useRouter();
  const { fetchOrderById, loading, singleOrder, reorder } = useOrder();
  const { submitComplaint, btnLoading  , fetchComplaintByOrderId ,complaint} = useComplaintContext();

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  
  useEffect(()=>{
    if(id){
     fetchComplaintByOrderId(id);
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id]);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: "" });
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setErrors({ ...errors, image: "" });
  };

  const validateComplaintForm = () => {
    const newErrors = {};
    if (!message.trim()) {
      newErrors.message = "Please describe your complaint";
    }
    if (message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    if (!validateComplaintForm()) return;

    const formData = new FormData();
    formData.append("orderId", singleOrder._id);
    formData.append("sellerId", singleOrder.sellerId);
    formData.append("message", message.trim());
    if (image) {
      formData.append("image", image);
    }

    try {
      await submitComplaint(formData);
      fetchOrderById(id)
     fetchComplaintByOrderId(id);

      setMessage("");
      setImage(null);
      setImagePreview(null);
      setErrors({});
    } catch (error) {
      console.error("Failed to submit complaint:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock className="w-4 h-4" />;
      case "Out for Delivery":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loading />;
  }

  if (!singleOrder) {
    return (
      <div className="min-h-screen py-8 ">
        <div className=" mx-auto">
          <div className="bg-white rounded-lg border border-gray-200  text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Order not found
            </h3>
            <p className="text-gray-500 mb-6">
              The order you're looking for doesn't exist
            </p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="printable-area" className="min-h-screen ">
      {/* Header - Hidden in print */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className=" mx-auto  py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Orders</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => reorder(singleOrder._id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Reorder
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block bg-white border-b-2 border-gray-300 pb-6 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Invoice
          </h1>
          <p className="text-gray-600">Order ID: #{singleOrder._id}</p>
          <p className="text-sm text-gray-500 mt-1">
            Generated on {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 print:px-0">
        {/* Order Status Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 print:border print:rounded-none">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Order #{singleOrder._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(singleOrder.createdAt)}
              </p>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium self-start ${getStatusColor(
                singleOrder.orderStatus
              )}`}
            >
              {getStatusIcon(singleOrder.orderStatus)}
              <span>{singleOrder.orderStatus}</span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Items</p>
              <p className="font-semibold text-gray-900">
                {singleOrder.items.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="font-semibold text-gray-900">
                ₹{singleOrder.totalAmount?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Payment</p>
              <p className="font-semibold text-gray-900">
                {singleOrder.paymentMethod || "COD"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Delivery</p>
              <p className="font-semibold text-gray-900">Standard</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items Ordered - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6 print:border print:rounded-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-3">
              {singleOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Link href={`/details/${item.productId.slug}`}>
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.productId?.images?.[0] ? (
                        <img
                          src={item.productId.images[0]}
                          alt={item.productId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                      {item.productId?.name || "Product Unavailable"}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity)?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary in Items Section for mobile */}
            <div className="mt-6 pt-6 border-t border-gray-200 lg:hidden">
              <h3 className="font-semibold text-gray-900 mb-3">
                Bill Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{singleOrder.totalAmount?.toFixed(2)}
                  </span>
                </div>
                {singleOrder.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      ₹{singleOrder.deliveryFee?.toFixed(2)}
                    </span>
                  </div>
                )}
                {singleOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -₹{singleOrder.discount?.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-bold text-lg text-gray-900">
                    ₹{singleOrder.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bill Summary - Desktop only */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-4 sm:p-6 print:border print:rounded-none">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Bill Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{singleOrder.totalAmount?.toFixed(2)}
                  </span>
                </div>
                {singleOrder.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      ₹{singleOrder.deliveryFee?.toFixed(2)}
                    </span>
                  </div>
                )}
                {singleOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -₹{singleOrder.discount?.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">
                    ₹{singleOrder.totalAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 print:border print:rounded-none">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Address
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {singleOrder.address?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {singleOrder.address?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      {singleOrder.address?.addressLine ||
                        "Address not available"}
                    </p>
                    {singleOrder.address?.city && (
                      <p className="text-sm text-gray-600 mt-1">
                        {singleOrder.address.city}
                        {singleOrder.address.pincode &&
                          ` - ${singleOrder.address.pincode}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        {singleOrder.timeline && singleOrder.timeline.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mt-6 print:border print:rounded-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Timeline
            </h2>
            <div className="space-y-4">
              {singleOrder.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      index === 0 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {event.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Raise Complaint Section */}
{
  singleOrder.orderStatus === "delivered" &&
  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mt-6 print:hidden">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">
    {complaint ? "Complaint Details" : "Raise a Complaint"}
  </h2>

  {complaint ? (
    // ✅ Show Complaint Details if Exists
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-900">Status:</span>{" "}
          <span
            className={`${
              complaint.status === "Resolved"
                ? "text-green-600"
                : complaint.status === "Pending"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {complaint.status}
          </span>
        </p>

        <p className="text-sm text-gray-700 mt-2">
          <span className="font-medium text-gray-900">Message:</span>{" "}
          {complaint.message}
        </p>

        {complaint.image && (
          <div className="mt-3">
            <span className="font-medium text-gray-900">Attached Image:</span>
            <div className="mt-2">
              <img
                src={complaint.image}
                alt="Complaint"
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
            </div>
          </div>
        )}

        {complaint.sellerReply && (
          <p className="text-sm text-gray-700 mt-3">
            <span className="font-medium text-gray-900">Seller Reply:</span>{" "}
            {complaint.sellerReply}
          </p>
        )}

        <p className="text-xs text-gray-500 mt-3">
          Submitted on: {new Date(complaint.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  ) : (
    // 🚀 Show Form if No Complaint
    <form onSubmit={handleComplaintSubmit}>
      <div className="space-y-4">
        {/* Message Box */}
        <div>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message) setErrors({ ...errors, message: "" });
            }}
            placeholder="Describe your issue..."
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm ${
              errors.message
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300"
            }`}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Upload Image (optional)
          </label>

          {!imagePreview ? (
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                id="complaintImage"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="complaintImage"
                className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition"
              >
                Browse File
              </label>
              <span className="text-sm text-gray-500">PNG, JPG up to 5MB</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-md border border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition"
              >
                Remove
              </button>
            </div>
          )}

          {errors.image && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.image}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={btnLoading}
          className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {btnLoading ? "Submitting..." : "Submit Complaint"}
        </button>
      </div>
    </form>
  )}
</div>
}

      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-12 pt-6 border-t-2 border-gray-300 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Thank you for shopping with us!
        </p>
        <p className="text-xs text-gray-500">
          For any queries, contact our customer support
        </p>
      </div>

      {/* Print Styles */}
   <style jsx global>{`
  @media print {
    /* Hide everything except the printable area */
    body * {
      visibility: hidden;
    }
    #printable-area, #printable-area * {
      visibility: visible;
    }
    #printable-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }

    /* Optional clean layout for print */
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`}</style>
    </div>
  );
};

export default OrderDetails;