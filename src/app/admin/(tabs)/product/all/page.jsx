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
  MoreHorizontal,
  Upload,
} from "lucide-react";
import { useProductContext } from "@/context/product";
import { useCategoryContext } from "@/context/category";
import { useSubcategoryContext } from "@/context/subcategory";
import { useBrandContext } from "@/context/brand";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

const ProductTable = () => {
  const {
    fetchProduct,
    products,
    loading,
    DeleteProduct,
    setSelectedProductEdit,
    pagination,
    updateProductStatus,
  } = useProductContext();

  const router = useRouter();

  const { categories } = useCategoryContext();
  const { subcategories } = useSubcategoryContext();
  const { brands } = useBrandContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    categoryFilter,
    subcategoryFilter,
    brandFilter,
    statusFilter,
    productsPerPage,
  ]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const fetchProducts = (page = currentPage) => {
    const filters = {
      page: page,
      limit: productsPerPage,
      status: statusFilter,
    };

    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }

    if (categoryFilter) {
      filters.category = categoryFilter;
    }

    if (subcategoryFilter) {
      filters.subcategory = subcategoryFilter;
    }

    if (brandFilter) {
      filters.brand = brandFilter;
    }

    console.log("Fetching products with filters:", filters);
    fetchProduct(filters);
  };

  const filteredProducts = products;

  const handleEdit = (product) => {
    router.push(`/admin/product/update/${product.slug}`);
  };

  const handleDelete = async (id, status) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await updateProductStatus(id, status);
      fetchProducts(currentPage);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getFilteredSubcategories = () => {
    if (!categoryFilter) return subcategories;
    return subcategories.filter((sub) => sub.category._id === categoryFilter);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      deactive: { bg: "bg-red-100", text: "text-red-800", label: "Inactive" },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Pending",
      },
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Product Management
                </h1>
                <p className="text-sm text-gray-600">
                  Create and manage your products
                </p>
              </div>
              <div className="flex gap-1">
                <Link href="/admin/product/add">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                </Link>
                <Link href="/admin/product/export">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    Export
                  </button>
                </Link>
                <Link href="/admin/product/import">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    Import
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
                  placeholder="Search products or brands..."
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
                value={productsPerPage}
                onChange={(e) => setProductsPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="hidden md:flex items-center gap-3 flex-wrap">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setSubcategoryFilter("");
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={subcategoryFilter}
                onChange={(e) => setSubcategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={!categoryFilter}
              >
                <option value="">All Subcategories</option>
                {getFilteredSubcategories().map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>

              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="active">Active Products</option>
                <option value="deactive">Inactive Products</option>
                <option value="">All Status</option>
              </select>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {showMobileFilters && (
                <div className="mt-3 space-y-3 p-3 bg-white rounded-md border border-gray-200">
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      setCategoryFilter(selectedCategory);
                      setSubcategoryFilter("");
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={subcategoryFilter}
                    onChange={(e) => {
                      setSubcategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={!categoryFilter}
                  >
                    <option value="">All Subcategories</option>
                    {getFilteredSubcategories().map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={brandFilter}
                    onChange={(e) => {
                      setBrandFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="active">Active Products</option>
                    <option value="deactive">Inactive Products</option>
                    <option value="">All Status</option>
                  </select>
                </div>
              )}
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-12 text-center text-gray-500 text-sm"
                      >
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <img
                              src={
                                product.images?.[0] || "/placeholder-image.png"
                              }
                              alt={product.title}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                            />
                            <div className="ml-3 min-w-0">
                              <div
                                className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                                title={product.title}
                              >
                                {truncateText(product.title, 30)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div
                            className="max-w-[120px] truncate"
                            title={product.brand?.name || "N/A"}
                          >
                            {truncateText(product.brand?.name, 15)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 max-w-[100px] truncate">
                            {truncateText(product.category?.name, 12)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {formatPrice(product.units?.[0]?.finalPrice)}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(product.status)}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 font-mono">
                          <div className="max-w-[100px] truncate">
                            {product.stock}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link href={`/details/${product.slug}`}>
                              <button
                                className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-gray-600 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {product.status === "active" ? (
                              <button
                                onClick={() =>
                                  handleDelete(product._id, "deactive")
                                }
                                className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleDelete(product._id, "active")
                                }
                                className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                                title="Delete"
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
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No products found
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="p-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={product.images?.[0] || "/placeholder-image.png"}
                          alt={product.title}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3
                                className="text-sm font-medium text-gray-900 truncate"
                                title={product.title}
                              >
                                {product.title}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1">
                                {product.brand?.name || "N/A"}
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  {product.category?.name || "N/A"}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatPrice(product.units?.[0]?.finalPrice)}
                                </span>
                                {getStatusBadge(product.status)}
                              </div>
                              {product.fssaiLicense && (
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                  FSSAI:{" "}
                                  {truncateText(product.fssaiLicense, 20)}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Link href="/details">
                                <button
                                  className="text-blue-600 hover:text-blue-900 p-1.5 rounded-md hover:bg-blue-50"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-gray-600 hover:text-gray-900 p-1.5 rounded-md hover:bg-gray-50"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
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
                        pagination.totalProducts
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {pagination.totalProducts}
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
                              className={`px-2 py-1 border rounded text-xs ${
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

export default ProductTable;
