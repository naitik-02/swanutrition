"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Calendar,
  AlertCircle,
  X,
  Send,
  Loader2,
} from "lucide-react";
import { useComplaintContext } from "@/context/complaint";
import Loading from "@/components/loading";

const ComplaintsTable = () => {
  const {
    complaints,
    complaint: selectedComplaintData,
    fetchComplaints,
    fetchComplaintById,
    replyToComplaint,
    updateComplaintStatus,
    btnLoading,
    loading,
  } = useComplaintContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintsPerPage] = useState(10);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      complaint.userId?.name?.toLowerCase().includes(searchLower) ||
      complaint.userId?.email?.toLowerCase().includes(searchLower) ||
      complaint.orderId?._id?.includes(searchTerm);

    const matchesStatus = !statusFilter || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * complaintsPerPage;
  const endIndex = startIndex + complaintsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, endIndex);

  useEffect(() => {
    const total = filteredComplaints.length;
    const totalPages = Math.ceil(total / complaintsPerPage);
    setPagination({ total, totalPages });
  }, [filteredComplaints.length, complaintsPerPage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleView = async (complaint) => {
    await fetchComplaintById(complaint._id);
    setSelectedComplaint(complaint);
    setReplyText("");
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedComplaint(null);
    setShowModal(false);
    setReplyText("");
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    await updateComplaintStatus(complaintId, newStatus);
    fetchComplaints();
    if (selectedComplaint) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      alert("Please enter a reply");
      return;
    }
    await replyToComplaint(selectedComplaint._id, replyText);
    setReplyText("");
    await fetchComplaintById(selectedComplaint._id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_review":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return "✓";
      case "pending":
        return "⏳";
      case "in_review":
        return "→";
      case "rejected":
        return "✕";
      default:
        return "○";
    }
  };

  if (loading && !complaints.length) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complaints Management
            </h1>
            <p className="text-gray-600">
              Manage customer complaints, replies, and resolution status
            </p>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_review">in_review</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>

              <div className="text-sm text-gray-600">
                Total: {pagination.total || 0} complaints
              </div>
            </div>
          </div>
        </div>

        {/* Main Complaints Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              All Complaints
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Complaint Info
                  </th>

                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {paginatedComplaints.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {loading
                        ? "Loading complaints..."
                        : "No complaints found"}
                    </td>
                  </tr>
                ) : (
                  paginatedComplaints.map((complaint, index) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              #{index + 1}
                            </div>
                            <div className="text-sm text-gray-500">
                              Order: #
                              {complaint.orderId?._id?.slice(-6) || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {getStatusIcon(complaint.status)}
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          {formatDate(complaint.createdAt)}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleView(complaint)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
                  {pagination.total} total complaints)
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
                    }
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(pagination.totalPages, currentPage + 1)
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

        {/* Modal */}
        {showModal && selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Complaint Details - #{selectedComplaint._id.slice(-6)}
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
                {/* Status and Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Complaint Status
                    </h4>
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(
                          selectedComplaint.status
                        )}`}
                      >
                        {getStatusIcon(selectedComplaint.status)}
                        {selectedComplaint.status}
                      </span>
                      <div className="mt-3">
                        <select
                          value={selectedComplaint.status}
                          onChange={(e) =>
                            handleStatusChange(
                              selectedComplaint._id,
                              e.target.value
                            )
                          }
                          disabled={btnLoading}
                          className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_review">in_review</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
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
                          {formatDate(selectedComplaint.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Updated:</span>
                        <span className="font-medium">
                          {formatDate(selectedComplaint.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complaint Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Complaint Description
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedComplaint.description ||
                      selectedComplaint.message ||
                      "No description provided"}
                  </p>
                </div>

                {/* Complaint Image */}
                {selectedComplaint.image && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Attached Image
                    </h4>
                    <div className="bg-white rounded-lg p-2 border border-gray-200">
                      <img
                        src={selectedComplaint.image}
                        alt="Complaint evidence"
                        className="w-full h-auto max-h-96 object-contain rounded"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML =
                            '<p class="text-sm text-gray-500 text-center py-4">Image could not be loaded</p>';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Seller Reply Section */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Your Reply
                  </h4>
                  {selectedComplaintData?.sellerReply ? (
                    <div className="bg-white rounded-lg p-3 mb-3 border border-blue-200">
                      <p className="text-sm text-gray-700">
                        {selectedComplaintData.sellerReply}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-3">
                      No reply has been added yet.
                    </p>
                  )}
                  <div className="space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Enter your reply to the customer..."
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <button
                      onClick={handleReplySubmit}
                      disabled={btnLoading || !replyText.trim()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {btnLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
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

export default ComplaintsTable;
