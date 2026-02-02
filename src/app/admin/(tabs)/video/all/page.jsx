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
  Play,
  ThumbsUp,
  Share2,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

const VideoTable = () => {
  const router = useRouter();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(10);
  const [pagination, setPagination] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchVideos(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, videosPerPage]);

  useEffect(() => {
    fetchVideos(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const fetchVideos = async (page = currentPage) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: videosPerPage.toString(),
      });

      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      const response = await fetch(`/api/Admin/video?${params}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        setVideos(data.videos || []);
        setPagination(data.pagination || null);
      } else {
        console.error("Failed to fetch videos:", data.message);
        setVideos([]);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    router.push(`/admin/video/update/${video.slug}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await fetch(`/api/Admin/video/delete/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          alert("Video deleted successfully");
          fetchVideos(currentPage);
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete video");
        }
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Error deleting video");
      }
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

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Video Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage and monitor your video content
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/video/add">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Add Video
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search videos by title or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results per page:
              </label>
              <select
                value={videosPerPage}
                onChange={(e) => setVideosPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
         <Loading/>
        )}

        {!loading && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {videos.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-12 text-center text-gray-500 text-sm"
                      >
                        No videos found
                      </td>
                    </tr>
                  ) : (
                    videos.map((video, index) => (
                      <tr key={video._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {(currentPage - 1) * videosPerPage + index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative w-20 h-12 bg-gray-200 rounded-lg overflow-hidden group">
                            {video.video ? (
                              <>
                                <video
                                  src={video.video}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Play className="w-6 h-6 text-white" />
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Play className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="text-sm font-medium text-gray-900 max-w-[200px] truncate"
                            title={video.title}
                          >
                            {truncateText(video.title, 40)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="text-sm text-gray-600 max-w-[150px] truncate font-mono"
                            title={video.slug}
                          >
                            {truncateText(video.slug, 20)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div
                            className="text-xs text-gray-600 font-mono max-w-[120px] truncate"
                            title={video.product}
                          >
                            {truncateText(video.product, 15)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 text-xs">
                            <div className="flex items-center gap-1 text-gray-600">
                              <BarChart3 className="w-3 h-3" />
                              <span>{formatNumber(video.views || 0)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{formatNumber(video.likes || 0)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                              <Share2 className="w-3 h-3" />
                              <span>{formatNumber(video.shares || 0)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {video.video && (
                              <a
                                href={video.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                title="View Video"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                            )}
                            {/* <button
                              onClick={() => handleEdit(video)}
                              className="text-gray-600 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button> */}
                            <button
                              onClick={() => handleDelete(video._id)}
                              className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors"
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

            {/* Mobile Cards */}
            <div className="md:hidden">
              {videos.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No videos found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {videos.map((video, index) => (
                    <div key={video._id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-24 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 group">
                          {video.video ? (
                            <>
                              <video
                                src={video.video}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-6 h-6 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                            #{(currentPage - 1) * videosPerPage + index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3
                                className="text-sm font-medium text-gray-900 line-clamp-2"
                                title={video.title}
                              >
                                {video.title}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1 font-mono">
                                {truncateText(video.slug, 25)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Product: {truncateText(video.product, 20)}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <BarChart3 className="w-3 h-3" />
                                  <span>{formatNumber(video.views || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{formatNumber(video.likes || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-green-600">
                                  <Share2 className="w-3 h-3" />
                                  <span>{formatNumber(video.shares || 0)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                              {video.video && (
                                <a
                                  href={video.video}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                onClick={() => handleEdit(video)}
                                className="text-gray-600 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-50"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(video._id)}
                                className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                        pagination.totalVideos,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {pagination.totalVideos}
                    </span>{" "}
                    results
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

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
                              pagination.currentPage - 2,
                            );
                            const end = Math.min(
                              pagination.totalPages,
                              start + 4,
                            );
                            pageNumber = start + i;
                            if (pageNumber > end) return null;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-2 py-1 border rounded text-xs ${
                                pagination.currentPage === pageNumber
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
    </div>
  );
};

export default VideoTable;
