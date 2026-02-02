"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Globe,
  Upload,
  Trash2,
} from "lucide-react";
import { usePageContext } from "@/context/pages";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import QuickEditPopup from "@/components/(admin)/(pages)/QuickEdit";

const PagesTable = () => {
  const {
    fetchPages,
    pages,
    loading,
    deletePage,
    setSelectedPageEdit,
    pagination,
    updatePage,
    updatePageStatus,
  } = usePageContext();

  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesPerPage, setPagesPerPage] = useState(10);
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [selectedPageForEdit, setSelectedPageForEdit] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);



  //  useEffect(() => {
  //   fetchPages();
  // }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchPagesData(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, pagesPerPage]);

  useEffect(() => {
    fetchPagesData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchPagesData(1);
  }, []);

  const fetchPagesData = (page = currentPage) => {
    const filters = {
      page: page,
      limit: pagesPerPage,
    };

    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }

    fetchPages(filters);
  };

  const filteredPages = pages;

  const handleEdit = (page) => {
    router.push(`/admin/page/update/${page.slug}`);
  };

  const handleDelete = async (id, status) => {
    const confirmMessage =
      status === "trash"
        ? "Are you sure you want to move this page to trash?"
        : "Are you sure you want to restore this page?";

    if (window.confirm(confirmMessage)) {
      await updatePageStatus(id, status);
      fetchPagesData(currentPage);
    }
  };

  const handleStatusChange = async (pageId, newStatus) => {
    setStatusUpdating(pageId);
    try {
      await updatePageStatus(pageId, newStatus);
      fetchPagesData(currentPage);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Published",
      },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      private: { bg: "bg-gray-100", text: "text-gray-800", label: "Private" },
      trash: { bg: "bg-red-100", text: "text-red-800", label: "Trash" },
    };

    const config = statusConfig[status] || statusConfig.published;
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleQuickEdit = (page) => {
    setSelectedPageForEdit(page);
    setShowQuickEdit(true);
  };

  const handleQuickEditSave = async (formData) => {
    try {
      setShowQuickEdit(false);
      await updatePage(selectedPageForEdit._id, formData);
      setSelectedPageForEdit(null);
      fetchPagesData(currentPage);
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Pages Management
                </h1>
                <p className="text-sm text-gray-600">
                  Create and manage your website pages
                </p>
              </div>
              <div className="flex gap-1">
                <Link href="/admin/page/add">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Add New Page
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search pages by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Show:
                  </label>
                  <select
                    value={pagesPerPage}
                    onChange={(e) => setPagesPerPage(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-500">entries</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && <Loading />}

        {!loading && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-12 text-center text-gray-500 text-sm"
                      >
                        No pages found
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((page) => (
                      <tr key={page._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {page.title}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <button
                                onClick={() => handleQuickEdit(page)}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Quick Edit
                              </button>
                              <span className="text-gray-400">|</span>
                              <button
                                onClick={() => handleEdit(page)}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Edit Page
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <span className="font-mono">/{page.slug}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            {getStatusBadge(page.status)}
                            <select
                              value={page.status}
                              onChange={(e) =>
                                handleStatusChange(page._id, e.target.value)
                              }
                              disabled={statusUpdating === page._id}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="private">Private</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          <div>
                            <div className="text-xs text-gray-500">
                              Published
                            </div>
                            <div>{formatDate(page.createdAt)}</div>
                          </div>
                          {page.updatedAt &&
                            page.updatedAt !== page.createdAt && (
                              <div className="mt-1">
                                <div className="text-xs text-gray-500">
                                  Last Modified
                                </div>
                                <div className="text-xs">
                                  {formatDate(page.updatedAt)}
                                </div>
                              </div>
                            )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/${page.slug}`} target="_blank">
                              <button
                                className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                title="View Page"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                            {page.status !== "trash" ? (
                              <button
                                onClick={() => handleDelete(page._id, "trash")}
                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                                title="Move to Trash"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleDelete(page._id, "published")
                                }
                                className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors"
                                title="Restore"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {filteredPages.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No pages found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPages.map((page) => (
                    <div key={page._id} className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {page.title}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1 font-mono">
                            /{page.slug}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>{getStatusBadge(page.status)}</div>
                          <select
                            value={page.status}
                            onChange={(e) =>
                              handleStatusChange(page._id, e.target.value)
                            }
                            disabled={statusUpdating === page._id}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </div>

                        <div className="text-xs text-gray-500">
                          <div>Created: {formatDate(page.createdAt)}</div>
                          {page.updatedAt &&
                            page.updatedAt !== page.createdAt && (
                              <div>Modified: {formatDate(page.updatedAt)}</div>
                            )}
                        </div>

                        <div className="flex items-center gap-1 text-xs">
                          <button
                            onClick={() => handleQuickEdit(page)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Quick Edit
                          </button>
                          <span className="text-gray-400">|</span>
                          <button
                            onClick={() => handleEdit(page)}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Edit Page
                          </button>
                          <span className="text-gray-400">|</span>

                          {page.status !== "trash" ? (
                            <>
                              <span className="text-gray-400">|</span>
                              <button
                                onClick={() => handleDelete(page._id, "trash")}
                                className="text-red-600 hover:text-red-800 hover:underline"
                              >
                                Trash
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-400">|</span>
                              <button
                                onClick={() =>
                                  handleDelete(page._id, "published")
                                }
                                className="text-green-600 hover:text-green-800 hover:underline"
                              >
                                Restore
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.currentPage * pagination.limit,
                        pagination.totalItems || pagination.totalPages
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {pagination.totalItems || pagination.totalPages}
                    </span>{" "}
                    results
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page numbers */}
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          let pageNumber;
                          if (pagination.totalPages <= 5) {
                            pageNumber = i + 1;
                          } else {
                            const start = Math.max(
                              1,
                              pagination.currentPage - 2
                            );
                            const end = Math.min(
                              pagination.totalPages,
                              start + 4
                            );
                            pageNumber = start + i;
                            if (pageNumber > end) return null;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-3 py-1 border rounded text-xs ${
                                pagination.currentPage === pageNumber
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <QuickEditPopup
        isOpen={showQuickEdit}
        onClose={() => {
          setShowQuickEdit(false);
          setSelectedPageForEdit(null);
        }}
        page={selectedPageForEdit}
        onSave={handleQuickEditSave}
        btnLoading={loading}
      />
    </div>
  );
};

export default PagesTable;
