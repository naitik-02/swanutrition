"use client";
import CategorySection from "@/components/(customer)/CategorySection";
import ProductCard from "@/components/(customer)/ProductCard";
import Selecttabs from "@/components/(customer)/Selecttabs";
import React, { useState, useMemo, useEffect } from "react";
import CategoryCard from "../../../components/(customer)/CategoryCard";
import { useCategoryContext } from "@/context/category";
import { useSubcategoryContext } from "@/context/subcategory";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const Search = ({ searchValue }) => {
  const { categories } = useCategoryContext();
  const { subcategories } = useSubcategoryContext();
  const [selectedSubSlug, setSelectedSubSlug] = useState("");
  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedSub, setSelectedSub] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState(searchValue);

  // Initialize from URL params on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "";
    const subcategoryFromUrl = searchParams.get("subcategory") || "";
    const searchFromUrl = searchParams.get("search") || searchValue || "";

    setSelectedCategory(categoryFromUrl);
    setSelectedSubSlug(subcategoryFromUrl);
    setSearch(searchFromUrl);
  }, [searchParams, searchValue]);

  const fetchProduct = async ({
    category,
    search,
    subcategory,
    page = 1,
    limit = 10,
  }) => {
    try {
      const queryParams = new URLSearchParams();

      if (category) queryParams.append("category", category);
      if (subcategory) queryParams.append("subcategory", subcategory);
      if (search) queryParams.append("search", search);

      queryParams.append("page", page);
      queryParams.append("limit", limit);

      console.log("Fetching with query params:", queryParams.toString());

      const { data } = await axios.get(
        `/api/User/products?${queryParams.toString()}`,
      );

      setProducts(data?.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProduct({
      category: selectedCategory,
      subcategory: selectedSubSlug,
      search: search,
    });
  }, [selectedCategory, selectedSubSlug, search]);

  const handleCateogorySelect = (cat) => {
    const params = new URLSearchParams(searchParams.toString());
    setSelectedCategory(cat);

    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    
    router.push(`?${params.toString()}`);
  };

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategory) return [];

    return subcategories?.filter(
      (sub) =>
        sub?.category === selectedCategory ||
        sub?.category?._id === selectedCategory,
    );
  }, [subcategories, selectedCategory]);

  return (
    <div className="max-w-7xl mb-10 m-auto px-5 md:px-20">
      <section className="mt-10 flex flex-col gap-10">
        <h1 className="text-center font-medium text-3xl">
          {search ? `Search Results for "${search}"` : "Everyday Multivitamin for Total Wellness"}
        </h1>

        <div className="">
          <div className="flex justify-center gap-[15px] align-middle">
            {categories.map((cat) => (
              <div
                onClick={() => handleCateogorySelect(cat.slug)}
                className=""
                key={cat._id}
              >
                <CategoryCard cat={cat} />
              </div>
            ))}
          </div>
        </div>

        <Selecttabs
          subs={filteredSubcategories}
          selected={selectedSub}
          setSelected={setSelectedSub}
          onSelect={(sub) => {
            setSelectedSubSlug(sub.slug);
          }}
        />
      </section>

      <section className="mt-10">
        {products.length === 0 ? (
          <p className="text-center text-gray-500">
            {search ? `No products found for "${search}"` : "No products found"}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Search;