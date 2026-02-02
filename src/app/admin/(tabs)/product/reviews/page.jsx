"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  StarOff,
  MessageCircle,
  Reply,
  Calendar,
  User,
  X,
} from "lucide-react";
import Link from "next/link";

// Demo data for reviews
const demoReviews = [
  {
    _id: "1",
    author: "John Doe",
    email: "john@example.com",
    rating: 5,
    review: "Excellent product! The quality is outstanding and delivery was super fast. Highly recommend this to everyone. The packaging was also very good and the product arrived in perfect condition.",
    product: {
      _id: "prod1",
      name: "Organic Basmati Rice 5kg",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-15T10:30:00Z",
    status: "approved",
    reply: null
  },
  {
    _id: "2",
    author: "Sarah Johnson",
    email: "sarah@example.com",
    rating: 4,
    review: "Good product overall. The packaging was nice and the taste is authentic. Could be a bit cheaper though. Will order again if there's a discount.",
    product: {
      _id: "prod2",
      name: "Premium Olive Oil 500ml",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-14T15:45:00Z",
    status: "approved",
    reply: "Thank you for your feedback! We appreciate your honest review."
  },
  {
    _id: "3",
    author: "Mike Chen",
    email: "mike@example.com",
    rating: 3,
    review: "Average product. It's okay but nothing special. The delivery took longer than expected. Quality is decent but not exceptional.",
    product: {
      _id: "prod3",
      name: "Whole Wheat Flour 1kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-13T09:20:00Z",
    status: "pending",
    reply: null
  },
  {
    _id: "4",
    author: "Emily Davis",
    email: "emily@example.com",
    rating: 5,
    review: "Love this product! Best quality I've found online. Will definitely order again. Fast shipping too! The customer service was also excellent.",
    product: {
      _id: "prod4",
      name: "Organic Honey 250g",
      image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-12T14:15:00Z",
    status: "approved",
    reply: "Thank you so much for your wonderful review! We're thrilled you loved our organic honey."
  },
  {
    _id: "5",
    author: "Robert Wilson",
    email: "robert@example.com",
    rating: 2,
    review: "Not satisfied with the quality. The product arrived damaged and the taste was off. Would not recommend. Poor packaging and delayed delivery.",
    product: {
      _id: "prod5",
      name: "Cashew Nuts 500g",
      image: "https://images.unsplash.com/photo-1599599810694-57a2ca8276a8?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-11T11:30:00Z",
    status: "flagged",
    reply: null
  },
  {
    _id: "6",
    author: "Lisa Anderson",
    email: "lisa@example.com",
    rating: 4,
    review: "Pretty good product. The packaging is excellent and the product is fresh. Good value for money. Will consider buying again.",
    product: {
      _id: "prod6",
      name: "Green Tea Bags 100ct",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-10T16:45:00Z",
    status: "approved",
    reply: null
  },
  {
    _id: "7",
    author: "David Brown",
    email: "david@example.com",
    rating: 5,
    review: "Exceptional quality and service! This is exactly what I was looking for. The customer service is also top-notch. Highly recommended!",
    product: {
      _id: "prod7",
      name: "Almond Butter 300g",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-09T13:20:00Z",
    status: "approved",
    reply: "We're so happy to hear about your positive experience! Thank you for choosing us."
  },
  {
    _id: "8",
    author: "Jennifer Taylor",
    email: "jennifer@example.com",
    rating: 3,
    review: "It's an okay product. Nothing extraordinary but serves the purpose. Delivery was on time. Could be improved in terms of packaging.",
    product: {
      _id: "prod8",
      name: "Quinoa Seeds 1kg",
      image: "https://images.unsplash.com/photo-1605833337007-d3c8c34c8633?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-08T10:10:00Z",
    status: "approved",
    reply: null
  },
  {
    _id: "9",
    author: "Alex Johnson",
    email: "alex@example.com",
    rating: 1,
    review: "Very disappointed with this purchase. The product quality is poor and doesn't match the description. Waste of money. Won't buy again.",
    product: {
      _id: "prod9",
      name: "Coconut Oil 500ml",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-07T08:30:00Z",
    status: "pending",
    reply: null
  },
  {
    _id: "10",
    author: "Maria Garcia",
    email: "maria@example.com",
    rating: 4,
    review: "Good quality product. The taste is authentic and the packaging is sturdy. Delivery was quick. Would recommend to others.",
    product: {
      _id: "prod10",
      name: "Turmeric Powder 200g",
      image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-06T12:15:00Z",
    status: "approved",
    reply: null
  },
  {
    _id: "11",
    author: "Tom Wilson",
    email: "tom@example.com",
    rating: 5,
    review: "Outstanding product! Exceeded my expectations in every way. The quality is premium and the service is excellent. Will definitely order more.",
    product: {
      _id: "prod11",
      name: "Organic Oats 1kg",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-05T14:45:00Z",
    status: "approved",
    reply: "Thank you for your amazing review! We're delighted you love our organic oats."
  },
  {
    _id: "12",
    author: "Anna Smith",
    email: "anna@example.com",
    rating: 2,
    review: "Product is okay but shipping was delayed. The quality is average for the price. Expected better based on reviews.",
    product: {
      _id: "prod12",
      name: "Chia Seeds 500g",
      image: "https://images.unsplash.com/photo-1605833337007-d3c8c34c8633?w=400&h=300&fit=crop"
    },
    submittedOn: "2024-12-04T09:30:00Z",
    status: "approved",
    reply: null
  }
];

const ReviewsTable = () => {
  const [reviews, setReviews] = useState(demoReviews);
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(8);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Functions to be implemented
  const fetchReviews = () => {};
  const deleteReview = (id) => {};
  const updateReview = (id, data) => {};
  const createReply = (reviewId, replyText) => {};
  const updateReply = (reviewId, replyText) => {};
  const deleteReply = (reviewId) => {};
  const changeReviewStatus = (reviewId, status) => {};

  useEffect(() => {
    let filtered = reviews.filter((review) => {
      const matchesSearch =
        review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.review.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = !ratingFilter || review.rating.toString() === ratingFilter;
      const matchesStatus = !statusFilter || review.status === statusFilter;

      return matchesSearch && matchesRating && matchesStatus;
    });

    setFilteredReviews(filtered);
    setCurrentPage(1);
  }, [searchTerm, ratingFilter, statusFilter, reviews]);

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < rating ? (
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
        ) : (
          <StarOff className="w-4 h-4 text-gray-300" />
        )}
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter(review => review._id !== id));
    }
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.reply || "");
    setShowReplyModal(true);
  };

  const handleSaveReply = () => {
    if (selectedReview) {
      setReviews(reviews.map(review => 
        review._id === selectedReview._id 
          ? { ...review, reply: replyText }
          : review
      ));
      setShowReplyModal(false);
      setSelectedReview(null);
      setReplyText("");
    }
  };

  const handleCloseModal = () => {
    setShowReplyModal(false);
    setSelectedReview(null);
    setReplyText("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reviews Management
            </h1>
            <p className="text-gray-600">
              Manage customer reviews and ratings
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by author, product, or review content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>

              <div className="text-sm text-gray-600">
                Total: {filteredReviews.length} reviews
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Author
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Product
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  currentReviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {review.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="ml-1 text-xs text-gray-600">
                            ({review.rating})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          <p className="line-clamp-2 mb-2">{review.review}</p>
                          {review.reply && (
                            <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 rounded text-xs">
                              <p className="text-blue-800">
                                <strong>Reply:</strong> {review.reply}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center">
                          <img
                            src={review.product.image}
                            alt={review.product.name}
                            className="w-8 h-8 rounded object-cover border"
                          />
                          <div className="ml-2">
                            <Link 
                              href={`/admin/products/${review.product._id}`}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline line-clamp-2"
                            >
                              {review.product.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-xs text-gray-900">
                        {formatDate(review.submittedOn)}
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleReply(review)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Reply"
                          >
                            <Reply className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900 p-1 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete"
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
                  {Math.min(startIndex + reviewsPerPage, filteredReviews.length)}{" "}
                  of {filteredReviews.length} results
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

        {/* Reply Modal */}
        {showReplyModal && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reply to {selectedReview.author}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center gap-1">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      by {selectedReview.author}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {selectedReview.review}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your reply here..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReply}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsTable;