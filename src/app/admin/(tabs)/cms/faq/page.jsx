"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  List,
  Search,
  Save,
  X,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useFaqContext } from "@/context/faq";

const Page = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [type, setType] = useState("shopping-and-delivery");
  const [status, setStatus] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFaq, setEditingFaq] = useState(null);

  const {
    faqs,
    createFaq,
    updateFaq,
    deleteFaq,
    fetchFaqs,
    loading,
    btnLoading,
  } = useFaqContext();

  useEffect(() => {
    fetchFaqs();
  }, []);

  const typeOptions = [
    { value: "shopping-and-delivery", label: "Shopping & Delivery" },
    { value: "returns-and-refunds", label: "Returns & Refunds" },
    { value: "payment-and-security", label: "Payment & Security" },
    { value: "account-and-orders", label: "Account & Orders" },
    { value: "others", label: "Others" },
  ];

  const statusOptions = [
    { value: "active", label: "Active", color: "text-green-600 bg-green-50" },
    { value: "inactive", label: "Inactive", color: "text-red-600 bg-red-50" },
  ];

  // Add FAQ
  const addFaq = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    if (!answer.trim()) {
      alert("Please enter an answer");
      return;
    }

    const faqData = {
      question: question.trim(),
      answer: answer.trim(),
      type,
      status,
    };

    await createFaq(faqData);

    setQuestion("");
    setAnswer("");
    setType("shopping-and-delivery");
    setStatus("active");
  };

  const startEditingFaq = (faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setType(faq.type);
    setStatus(faq.status);
  };

  const saveEditingFaq = async () => {
    if (!question.trim()) {
      alert("Question cannot be empty");
      return;
    }

    if (!answer.trim()) {
      alert("Answer cannot be empty");
      return;
    }

    const faqData = {
      question: question.trim(),
      answer: answer.trim(),
      type,
      status,
    };

    await updateFaq(editingFaq._id, faqData);
    cancelEditing();
  };

  const cancelEditing = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setType("shopping-and-delivery");
    setStatus("active");
  };

  const deleteFaqHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      await deleteFaq(id);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                FAQ Management
              </h1>
              <p className="text-gray-600">
                Create and manage frequently asked questions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Add/Edit FAQ Form */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter frequently asked question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer *
                  </label>
                  <textarea
                    placeholder="Enter detailed answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  >
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 py-3 px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={editingFaq ? saveEditingFaq : addFaq}
                    disabled={btnLoading}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {btnLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : editingFaq ? (
                      <Save className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {btnLoading
                      ? "Saving..."
                      : editingFaq
                      ? "Update FAQ"
                      : "Add FAQ"}
                  </button>

                  {editingFaq && (
                    <button
                      onClick={cancelEditing}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {faqs.length}
              </div>
              <div className="text-sm text-gray-600">Total FAQs</div>
            </div>
          </div>

          {/* Right Column - FAQ List */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <List className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    All FAQs
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                {/* FAQs List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm
                        ? "No FAQs found matching your search"
                        : "No FAQs available"}
                    </div>
                  ) : (
                    filteredFaqs.map((faq) => (
                      <div
                        key={faq._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start justify-between">
                          {/* FAQ Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {faq.question}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  faq.status === "active"
                                    ? "text-green-600 bg-green-50"
                                    : "text-red-600 bg-red-50"
                                }`}
                              >
                                {faq.status === "active" ? (
                                  <Eye className="w-3 h-3 inline mr-1" />
                                ) : (
                                  <EyeOff className="w-3 h-3 inline mr-1" />
                                )}
                                {faq.status}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                              {faq.answer.length > 100
                                ? faq.answer.substring(0, 100) + "..."
                                : faq.answer}
                            </p>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {
                                  typeOptions.find(
                                    (opt) => opt.value === faq.type
                                  )?.label
                                }
                              </span>
                              <span className="text-xs text-gray-400">
                                {faq.createdAt
                                  ? new Date(faq.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => startEditingFaq(faq)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit FAQ"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteFaqHandler(faq._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete FAQ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
