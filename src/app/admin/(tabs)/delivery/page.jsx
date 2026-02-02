"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bike,
  Phone,
  Calendar,
  Shield,
  X,
  Check,
  MapPin,
  User,
  Clock,
  CreditCard,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function DeliveryPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [partnersPerPage] = useState(10);
  
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch Partners
  async function loadPartners() {
    setLoading(true);

    const params = new URLSearchParams({
      search: searchTerm,
      status: statusFilter,
      page: currentPage,
      limit: partnersPerPage,
    });

    const res = await fetch(`/api/Admin/delivery/all?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      setPartners(data.partners || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPartners();
  }, [searchTerm, statusFilter, currentPage]);

  // Filter partners
  const filteredPartners = partners.filter((partner) => {
    const matchesVehicle = !vehicleFilter || partner.vehicleType === vehicleFilter;
    return matchesVehicle;
  });

  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);
  const startIndex = (currentPage - 1) * partnersPerPage;
  const currentPartners = filteredPartners.slice(
    startIndex,
    startIndex + partnersPerPage
  );

  async function updateStatus(partnerId, newStatus) {
    setBtnLoading(true);
    const res = await fetch(`/api/Admin/delivery/verify/${partnerId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Status updated to ${newStatus}`);
      loadPartners();
      if (selectedPartner && selectedPartner._id === partnerId) {
        setSelectedPartner({ ...selectedPartner, status: newStatus });
      }
    } else {
      alert(data.message || "Failed to update status");
    }
    setBtnLoading(false);
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery partner?")) {
      setBtnLoading(true);
      // Add your delete API call here
      await loadPartners();
      setBtnLoading(false);
    }
  };

  const handleView = (partner) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPartner(null);
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "blocked":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <Check className="w-3 h-3" />;
      case "rejected":
      case "blocked":
        return <X className="w-3 h-3" />;
      case "pending":
      case "under-review":
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getVehicleIcon = (vehicleType) => {
    return <Bike className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Delivery Partners Management
            </h1>
            <p className="text-gray-600">
              Manage delivery partners, their verification, and status
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="under-review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="blocked">Blocked</option>
              </select>

              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Vehicle Types</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="bicycle">Bicycle</option>
                <option value="electric-scooter">Electric Scooter</option>
                <option value="none">None</option>
              </select>

              <div className="text-sm text-gray-600">
                Total: {filteredPartners.length} partners
              </div>
            </div>
          </div>
        </div>

        {/* Main Partners Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Bike className="w-5 h-5" />
              All Delivery Partners
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner Info
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Vehicle
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Type
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
                {currentPartners.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No delivery partners found
                    </td>
                  </tr>
                ) : (
                  currentPartners.map((partner) => (
                    <tr key={partner._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {partner.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {partner.phone}
                            </div>
                            {partner.gender && (
                              <div className="text-sm text-gray-500">
                                {partner.gender}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-900 font-medium">
                            <MapPin className="w-3 h-3 mr-1" />
                            {partner.city}
                          </div>
                          {partner.vehicleType && (
                            <div className="flex items-center text-gray-500 mt-1">
                              {getVehicleIcon(partner.vehicleType)}
                              <span className="ml-1 capitalize">
                                {partner.vehicleType.replace("-", " ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              partner.status
                            )}`}
                          >
                            {getStatusIcon(partner.status)}
                            {partner.status}
                          </span>
                          {partner.status === "pending" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => updateStatus(partner._id, "approved")}
                                disabled={btnLoading}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                                title="Approve"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(partner._id, "rejected")}
                                disabled={btnLoading}
                                className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                                title="Reject"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm text-gray-900 capitalize">
                          {partner.workType?.replace("-", " ") || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          {formatDate(partner.createdAt)}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(partner)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {partner.status === "approved" && (
                            <button
                              onClick={() => updateStatus(partner._id, "pending")}
                              disabled={btnLoading}
                              className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                              title="Revoke Approval"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          {partner.status === "rejected" && (
                            <button
                              onClick={() => updateStatus(partner._id, "approved")}
                              disabled={btnLoading}
                              className="text-green-600 hover:text-green-900 p-1 rounded disabled:opacity-50"
                              title="Approve Partner"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(partner._id)}
                            disabled={btnLoading}
                            className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                            title="Delete Partner"
                          >
                            <Trash2 className="w-4 h-4" />
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
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + partnersPerPage, filteredPartners.length)}{" "}
                  of {filteredPartners.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
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

        {/* Partner Details Modal */}
        {showModal && selectedPartner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bike className="w-5 h-5" />
                  Partner Details - {selectedPartner.name}
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
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Personal Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedPartner.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedPartner.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium capitalize">
                          {selectedPartner.gender || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Father's Name:</span>
                        <span className="font-medium">
                          {selectedPartner.fatherName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joined:</span>
                        <span className="font-medium">
                          {formatDate(selectedPartner.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Work Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Bike className="w-4 h-4" />
                      Work Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">City:</span>
                        <span className="font-medium">{selectedPartner.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Work Type:</span>
                        <span className="font-medium capitalize">
                          {selectedPartner.workType?.replace("-", " ") || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle Type:</span>
                        <span className="font-medium capitalize">
                          {selectedPartner.vehicleType?.replace("-", " ") || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            selectedPartner.status
                          )}`}
                        >
                          {selectedPartner.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration:</span>
                        <span className="font-medium">
                          {selectedPartner.registrationComplete ? "Complete" : "Incomplete"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Verification Status
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(selectedPartner.verified || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        {value ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm capitalize">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Document Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Aadhaar Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Aadhaar Details</span>
                      </div>
                      <div className="pl-6 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Number:</span>
                          <span className="font-medium">
                            {selectedPartner.aadharNumber || "Not provided"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Verified:</span>
                          <span className="font-medium">
                            {selectedPartner.aadharVerified ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PAN Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="font-medium">PAN Details</span>
                      </div>
                      <div className="pl-6 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Number:</span>
                          <span className="font-medium">
                            {selectedPartner.panNumber || "Not provided"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">
                            {selectedPartner.panName || "N/A"}
                          </span>
                        </div>
                        {selectedPartner.panPhoto && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Photo:</span>
                            <a
                              href={selectedPartner.panPhoto}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Bank Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Name:</span>
                        <span className="font-medium">
                          {selectedPartner.bankName || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium">
                          {selectedPartner.accountNumber || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">IFSC Code:</span>
                        <span className="font-medium">
                          {selectedPartner.ifscCode || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedPartner.bankProof && (
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Bank Proof:</span>
                      <a
                        href={selectedPartner.bankProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                {(selectedPartner.motorcycleDetails || selectedPartner.evDetails) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Bike className="w-4 h-4" />
                      Vehicle Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      {selectedPartner.motorcycleDetails && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle Number:</span>
                            <span className="font-medium">
                              {selectedPartner.motorcycleDetails.vehicleNumber || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ownership:</span>
                            <span className="font-medium capitalize">
                              {selectedPartner.motorcycleDetails.ownership || "N/A"}
                            </span>
                          </div>
                          {selectedPartner.motorcycleDetails.rcPhoto && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">RC Photo:</span>
                              <a
                                href={selectedPartner.motorcycleDetails.rcPhoto}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          )}
                          {selectedPartner.motorcycleDetails.drivingLicense && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Driving License:</span>
                              <a
                                href={selectedPartner.motorcycleDetails.drivingLicense}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedPartner.evDetails && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle Type:</span>
                            <span className="font-medium capitalize">
                              {selectedPartner.evDetails.vehicleType?.replace("-", " ") || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ownership:</span>
                            <span className="font-medium capitalize">
                              {selectedPartner.evDetails.ownership || "N/A"}
                            </span>
                          </div>
                          {selectedPartner.evDetails.numberPlate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Number Plate:</span>
                              <span className="font-medium">
                                {selectedPartner.evDetails.numberPlate}
                              </span>
                            </div>
                          )}
                          {selectedPartner.evDetails.purchaseProof && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Purchase Proof:</span>
                              <a
                                href={selectedPartner.evDetails.purchaseProof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status Update Section */}
                {selectedPartner.status === "pending" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          updateStatus(selectedPartner._id, "under-review");
                          setSelectedPartner({ ...selectedPartner, status: "under-review" });
                        }}
                        disabled={btnLoading}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        Mark Under Review
                      </button>
                      <button
                        onClick={() => {
                          updateStatus(selectedPartner._id, "approved");
                          setSelectedPartner({ ...selectedPartner, status: "approved" });
                        }}
                        disabled={btnLoading}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve Partner
                      </button>
                      <button
                        onClick={() => {
                          updateStatus(selectedPartner._id, "rejected");
                          setSelectedPartner({ ...selectedPartner, status: "rejected" });
                        }}
                        disabled={btnLoading}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject Partner
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
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
}