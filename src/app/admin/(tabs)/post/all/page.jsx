"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { usePostContext } from "@/context/post";
import { usePostCategoryContext } from "@/context/postCategory";
import QuickEditPostPopup from "@/components/(admin)/(pages)/QuickEditPostPopup";

const BlogPostsTable = () => {
  const {
    posts,
    fetchPosts,
    deletePost,
    updatePostStatus,
    setSelectedPostEdit,
    updatePost,
    loading,
    pagination,
  } = usePostContext();

  const { postCategories } = usePostCategoryContext();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [selectedPostForEdit, setSelectedPostForEdit] = useState(null);

  // Memoized fetch function to prevent infinite loops
  const fetchPostsData = useCallback((page = currentPage) => {
    const filters = {
      page: page,
      limit: postsPerPage,
    };

    if (searchTerm.trim()) filters.search = searchTerm.trim();
    if (selectedCategory) filters.category = selectedCategory;

    fetchPosts(filters);
  }, [currentPage, postsPerPage, searchTerm, selectedCategory, fetchPosts]);

  // Initial load - sirf ek baar chalega
  useEffect(() => {
    fetchPostsData(1);
  }, []); // Empty dependency array - sirf mount pe chalega

  // Search/Filter changes - debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchPostsData(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, postsPerPage, selectedCategory]); // fetchPostsData ko remove kiya

  // Page change
  useEffect(() => {
    if (currentPage !== 1) { // Avoid duplicate call on mount
      fetchPostsData(currentPage);
    }
  }, [currentPage]); // fetchPostsData ko remove kiya

  const handleEdit = (post) => {
    setSelectedPostEdit(post);
    router.push("/admin/post/add");
  };

  const handleQuickEdit = (post) => {
    setSelectedPostForEdit(post);
    setShowQuickEdit(true);
  };

  const handleQuickEditSave = async (formData) => {
    try {
      setShowQuickEdit(false);
      await updatePost(selectedPostForEdit._id, formData);
      setSelectedPostForEdit(null);
      fetchPostsData(currentPage);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async (id, status) => {
    const confirmMsg =
      status === "trash"
        ? "Move post to trash?"
        : "Restore this post from trash?";

    if (window.confirm(confirmMsg)) {
      await deletePost(id);
      fetchPostsData(currentPage);
    }
  };

  const handleStatusChange = async (postId, newStatus) => {
    setStatusUpdating(postId);
    try {
      await updatePostStatus(postId, newStatus);
      fetchPostsData(currentPage);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { bg: "bg-green-100", text: "text-green-800", label: "Published" },
      draft: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Draft" },
      private: { bg: "bg-gray-100", text: "text-gray-800", label: "Private" },
      trash: { bg: "bg-red-100", text: "text-red-800", label: "Trash" },
    };

    const cfg = statusConfig[status] || statusConfig.published;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${cfg.bg} ${cfg.text}`}>
        {cfg.label}
      </span>
    );
  };

  const getCategoryName = (id) => {
    const cat = postCategories?.find((c) => c._id === id);
    return cat?.name || "Uncategorized";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">

        {/* HEADER BOX */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Posts Management</h1>
                <p className="text-sm text-gray-600">Create and manage your blog posts</p>
              </div>

              <Link href="/admin/post/add">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Add New Post
                </button>
              </Link>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">

              {/* SEARCH */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search posts by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* CATEGORY + SHOW */}
              <div className="flex items-center gap-4">

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {postCategories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Show:</label>
                  <select
                    value={postsPerPage}
                    onChange={(e) => setPostsPerPage(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* MAIN TABLE */}
        {loading ? (
          <Loading />
        ) : (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                      Post
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
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
                  {posts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-12 text-center text-gray-500 text-sm"
                      >
                        No posts found
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post._id} className="hover:bg-gray-50">

                        {/* POST */}
                        <td className="px-4 py-4">
                          <div className="flex gap-3 items-start">
                            {post.featuredImage ? (
                              <img
                                src={post.featuredImage}
                                className="w-16 h-12 object-cover rounded border"
                              />
                            ) : (
                              <div className="w-16 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                                No Image
                              </div>
                            )}

                            <div>
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {post.title}
                              </div>

                              <div className="flex items-center gap-1 text-xs">
                                <button
                                  onClick={() => handleQuickEdit(post)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  Quick Edit
                                </button>
                                <span className="text-gray-400">|</span>
                                <button
                                  onClick={() => handleEdit(post)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  Edit Post
                                </button>
                              </div>

                              {/* TAGS */}
                              {post.tags?.length > 0 && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {post.tags.slice(0, 3).map((tag, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                  {post.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                      +{post.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {getCategoryName(post.category?._id || post.category)}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            {getStatusBadge(post.status)}

                            <select
                              value={post.status}
                              onChange={(e) =>
                                handleStatusChange(post._id, e.target.value)
                              }
                              disabled={statusUpdating === post._id}
                              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="private">Private</option>
                            </select>
                          </div>
                        </td>

                        {/* DATE */}
                        <td className="px-4 py-4 text-sm text-gray-600">
                          <div>
                            <div className="text-xs text-gray-500">Published</div>
                            <div>
                              {formatDate(post.publishedAt || post.createdAt)}
                            </div>
                          </div>

                          {post.updatedAt !== post.createdAt && (
                            <div className="mt-1 text-xs">
                              <div className="text-gray-500">Last Modified</div>
                              {formatDate(post.updatedAt)}
                            </div>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Link href={`/${post.seoSlug}`} target="_blank">
                              <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>

                            {post.status !== "trash" ? (
                              <button
                                onClick={() => handleDelete(post._id, "trash")}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDelete(post._id, "published")}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
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

            {/* PAGINATION */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs">

                <div className="text-gray-600">
                  Showing{" "}
                  <b>{(pagination.currentPage - 1) * pagination.limit + 1}</b> to{" "}
                  <b>
                    {Math.min(
                      pagination.currentPage * pagination.limit,
                      pagination.totalItems
                    )}
                  </b>{" "}
                  of <b>{pagination.totalItems}</b> results
                </div>

                <div className="flex gap-1">

                  <button
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-3 h-3" /> Prev
                  </button>

                  <button
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1 hover:bg-gray-50"
                  >
                    Next <ChevronRight className="w-3 h-3" />
                  </button>

                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* QUICK EDIT POPUP - Conditional Rendering */}
      {showQuickEdit && (
        <QuickEditPostPopup
          isOpen={showQuickEdit}
          onClose={() => {
            setShowQuickEdit(false);
            setSelectedPostForEdit(null);
          }}
          post={selectedPostForEdit}
          onSave={handleQuickEditSave}
          btnLoading={loading}
          categories={postCategories}
        />
      )}
    </div>
  );
};

export default BlogPostsTable;