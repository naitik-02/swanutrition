"use client";

import Productcard from "@/components/(user)/productcard";
import { Clock, Filter, Grid3X3, List, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategoryContext } from "@/context/category";
import { useProductContext } from "@/context/product";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { categories } = useCategoryContext();
  const { fetchProduct, products } = useProductContext();

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const fetchProducts = () => {
    const filters = {};

    if (search.trim()) {
      filters.search = search.trim();
    }

    console.log("Fetching products with filters:", filters);
    fetchProduct(filters);
  };

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearch(query);
  }, [searchParams]);

 const filteredCategories = categories
  .filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  )
  .slice(0, 5); 

  const filteredProducts = products?.filter((prod) =>
    prod.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" min-h-screen ">
      <div className="max-w-7xl mx-auto ">
        {search && filteredCategories.length > 0 && (
          <div className=" ">
          
            <div className="pb-6">
              {filteredCategories.map((cat) => (
                <Link href={`/category/${cat.slug}`} key={cat._id}>
                  <div
                    key={cat._id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Image
                      src={cat?.image}
                      alt={cat.name}
                      height={24}
                      width={24}
                      className="object-cover rounded"
                    />
                    <span className="text-gray-700">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {search && filteredProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Showing result for "{search}"</h3>
              {/* <span className="text-sm font-bold text-gray-500">
                {filteredProducts.length} results
              </span> */}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product, index) => (
                <div key={index} className="hover:shadow-md transition-shadow">
                  <Productcard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {search &&
          filteredCategories.length === 0 &&
          filteredProducts.length === 0 && (
            <div className="text-center pt-12">
              <div className="text-gray-400 mb-3">
                <Filter size={32} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 ">Try different search terms</p>
              {/* <button
                onClick={() => setSearch("")}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Search
              </button> */}
            </div>
          )}

        {!search && (
          <div className="text-center py-16 bg-white rounded-lg border">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Start searching
            </h2>
            <p className="text-gray-600">
              Use the search bar above to find products and categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
