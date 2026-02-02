"use client";

import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const saved =
    typeof window !== "undefined"
      ? localStorage.getItem("homepageProducts")
      : null;

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [pagination, setPagination] = useState();
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProductEdit, setSelectedProductEdit] = useState(null);
  const [productLoading, setProductLoading] = useState(saved ? false : true);

  const [homepageProducts, setHomepageProducts] = useState(
    saved ? JSON.parse(saved) : {}
  );

  const [categoryProducts, setCategoryProducts] = useState([]);

  const fetchProduct = async ({
    category,
    search,
    subcategory,
    brand,
    status = "active",
    page = 1,
    limit = 10,
  }) => {
    try {
      setLoading(true);
      setProductLoading(true);

      const queryParams = new URLSearchParams();

      if (category) queryParams.append("category", category);
      if (brand) queryParams.append("brand", brand);
      if (status) queryParams.append("status", status);
      if (subcategory) queryParams.append("subcategory", subcategory);
      if (search) queryParams.append("search", search);

      queryParams.append("page", page);
      queryParams.append("limit", limit);

      console.log("Fetching with query params:", queryParams.toString());

      const { data } = await axios.get(
        `/api/User/products?${queryParams.toString()}`
      );

      setProducts(data?.products || []);
      setPagination(data?.pagination || {});
      setProductLoading(false);
    } catch (error) {
    } finally {
      setLoading(false);
      setProductLoading(false);
    }
  };
  const fetchSingleProduct = async (slug) => {
    try {
      setLoading(true);
      setProductLoading(true);
      const { data } = await axios.get(
        `/api/User/products/fetchProduct/${slug}`
      );
      setProduct(data?.product);
      setSimilarProducts(data?.similarProducts);
      setProductLoading(false);
      return data?.product || null;
    } catch (error) {
      console.error("Error fetching single product:", error.message);

      return {
        product: null,
        similarProducts: [],
      };
    } finally {
      setLoading(false);
      setProductLoading(false);
    }
  };

  const fetchHomepageProducts = async (categorySlugs = [], limit = 20) => {
    try {
      setProductLoading(true);

      const results = {};
      for (let slug of categorySlugs) {
        const { data } = await axios.get(
          `/api/User/products/?category=${slug}&limit=${limit}`
        );
        results[slug] = data?.products || [];
      }

      setHomepageProducts(results);

      localStorage.setItem("homepageProducts", JSON.stringify(results));

      setProductLoading(false);
      return results;
    } catch (error) {
      console.error("Error fetching homepage products:", error.message);
      setProductLoading(false);
      return {};
    }
  };

  const fetchProductsByCategory = async (categorySlug, limit = 100) => {
    try {
      setLoading(true);
      setProductLoading(true);

      const { data } = await axios.get(
        `/api/User/products/?category=${categorySlug}&limit=${limit}`
      );
      setCategoryProducts(data?.products || []);
      setProductLoading(false);
    } catch (error) {
      console.error("Error fetching category products:", error.message);
      setCategoryProducts([]);
    } finally {
      setLoading(false);
      setProductLoading(false);
    }
  };

  const fetchProductsBySubcategory = async (
    categorySlug,
    subSlug,
    limit = 100
  ) => {
    try {
      setProductLoading(true);

      setLoading(true);
      const { data } = await axios.get(
        `/api/User/products/?category=${categorySlug}&subcategory=${subSlug}&limit=${limit}`
      );
      setCategoryProducts(data?.products || []);
      setProductLoading(false);
    } catch (error) {
      console.error("Error fetching subcategory products:", error.message);
      setCategoryProducts([]);
    } finally {
      setLoading(false);
      setProductLoading(false);
    }
  };

  const createProduct = async (formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.post("/api/Admin/product/add/", formData, {
        headers: { token: localStorage.getItem("token") },
      });
      setProducts((prev) => [...prev, data.product]);
      toast.success(data.message || "Product created successfully");
      setBtnLoading(false);
      return { success: true };
    } catch (error) {
      setBtnLoading(false);
      const message = error.response?.data?.error || "Product creation failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const DeleteProduct = async (id) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.delete(`/api/Admin/product/delete/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setBtnLoading(false);
      toast.success(data?.message || "Product Deleted");
      fetchProduct({});
    } catch (error) {
      setBtnLoading(false);
      const message =
        error.response?.data?.message || "Product deletion failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const UpdateProduct = async (id, formData) => {
    try {
      setBtnLoading(true);
      const { data } = await axios.patch(
        `/api/Admin/product/update/${id}`,
        formData,
        { withCredentials: true }
      );
      fetchProduct({});
      toast.success(data.message || "Product updated successfully");
      setSelectedProductEdit(null);
      setBtnLoading(false);
      return { success: true };
    } catch (error) {
      setBtnLoading(false);
      const message = error.response?.data?.error || "Product update failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateProductStatus = async (id, status) => {
    try {
      setBtnLoading(true);

      const { data } = await axios.patch(
        `/api/Admin/product/update-status/${id}`,
        { status },
        { withCredentials: true }
      );

      fetchProduct({});
      toast.success(data.message || `Product status updated to ${status}`);

      setBtnLoading(false);
      return { success: true };
    } catch (error) {
      setBtnLoading(false);
      const message =
        error.response?.data?.message || "Failed to update product status";
      toast.error(message);
      return { success: false, message };
    }
  };

  // ------------------- RETURN -------------------
  return (
    <ProductContext.Provider
      value={{
        products,
        pagination,
        fetchProduct,

        createProduct,
        UpdateProduct,
        DeleteProduct,
        selectedProductEdit,
        setSelectedProductEdit,
        fetchSingleProduct,
        similarProducts,
        product,
        updateProductStatus,

        // new
        homepageProducts,
        fetchHomepageProducts,

        categoryProducts,
        fetchProductsByCategory,
        fetchProductsBySubcategory,
        productLoading,

        // utils
        btnLoading,
        loading,
        setBtnLoading,
        setLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
