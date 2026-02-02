"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  Upload,
  DollarSign,
  Camera,
  FileText,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

import BasicInformation from "@/components/(admin)/(product)/BasicInformation";
import CategorySection from "@/components/(admin)/(product)/CategorySection";
import { useCategoryContext } from "@/context/category";
import { useSubcategoryContext } from "@/context/subcategory";
import { useProductContext } from "@/context/product";
import { useBrandContext } from "@/context/brand";
import { useTagContext } from "@/context/productTag";
import Loading from "@/components/loading";

const UpdateProductPage = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [stock, setStock] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewLaunch, setIsNewLaunch] = useState(false);
  const [isSuperSaver, setIsSuperSaver] = useState(false);
  const [benifit, setBenifit] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [usage, setUsage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [units, setUnits] = useState([
    { unit: "", price: "", discount: "", finalPrice: "" },
  ]);
  const [returnable, setReturnable] = useState(false);
  const [returnNotes, setReturnNotes] = useState("No Return Policy");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productId, setProductId] = useState(null);

  const { categories } = useCategoryContext();
  const { subcategories } = useSubcategoryContext();
  const { UpdateProduct, btnLoading, fetchSingleProduct } = useProductContext();
  const { brands, fetchBrands } = useBrandContext();

  const router = useRouter();
  const params = useParams();
  const productSlug = params?.slug;

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productSlug) {
        setError("Product slug not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const product = await fetchSingleProduct(productSlug);

        if (!product) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        setProductId(product._id);
        setTitle(product.title || "");
        setSlug(product.slug || "");
        setBrand(product.brand?._id || "");
        setTags(product.tags || []);
        setDescription(product.description || "");
        setShortDescription(product.shortDescription || "");
        setCategory(product.category?._id || "");
        setSubcategory(product.subcategory?._id || "");
        setUnits(
          product.units || [
            { unit: "", price: "", discount: "", finalPrice: "" },
          ],
        );
        setStock(product.stock || "");
        setIsBestSeller(product.isBestSeller || "");
        setIsTrending(product.isTrending || "");
        setIsNewLaunch(product.isNewLaunch || "");
        setIsSuperSaver(product.isSuperSaver || "");
        setBenifit(product.benifit || "");
        setUsage(product.usage || "");
        setIngredient(product.ingredient || "");

        setReturnable(product.returnPolicy?.returnable || false);
        setReturnNotes(product.returnPolicy?.notes || "No Return Policy");

        const existingImgs =
          product.images?.map((img, i) => ({
            id: `existing-${i}`,
            file: null,
            url: img,
            name: `Existing Image ${i + 1}`,
            isExisting: true,
          })) || [];

        setExistingImages(existingImgs);
        setImages(existingImgs);

        setLoading(false);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Failed to load product data");
        setLoading(false);
      }
    };

    loadProduct();
  }, [productSlug]);

  const addUnit = () => {
    setUnits([...units, { unit: "", price: "", discount: "", finalPrice: "" }]);
  };

  const removeUnit = (index) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  const updateUnit = (index, field, value) => {
    const newUnits = [...units];
    newUnits[index][field] = value;
    setUnits(newUnits);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 10 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target.result,
            name: file.name,
            isExisting: false,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    setImages(images.filter((img) => img.id !== imageId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId) {
      alert("Product ID not found");
      return;
    }

    if (
      !title.trim() ||
      !brand.trim() ||
      !description.trim() ||
      !category ||
      !subcategory
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("slug", slug.trim());
    formData.append("brand", brand.trim());
    formData.append("shortDescription", shortDescription.trim());
    formData.append("stock", stock);
    formData.append("isTrending", isTrending);
    formData.append("tags", tags);
    formData.append("isBestSeller", isBestSeller);
    formData.append("isNewLaunch", isNewLaunch);
    formData.append("isSuperSaver", isSuperSaver);
    formData.append("benifit", benifit);
    formData.append("ingredient", ingredient);
    formData.append("usage", usage);

    formData.append("description", description);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("returnable", returnable);
    formData.append("returnNotes", returnNotes.trim());

    const existingImageUrls = images
      .filter((img) => img.isExisting)
      .map((img) => img.url);

    existingImageUrls.forEach((url) => {
      formData.append("existingImages", url);
    });

    images
      .filter((img) => !img.isExisting && img.file)
      .forEach((img) => {
        formData.append("images", img.file);
      });

    units.forEach((unit, index) => {
      formData.append(`units[${index}][unit]`, unit.unit);
      formData.append(`units[${index}][price]`, unit.price);
      formData.append(`units[${index}][discount]`, unit.discount);
      formData.append(`units[${index}][finalPrice]`, unit.finalPrice);
    });

    try {
      const result = await UpdateProduct(productId, formData);
      if (result?.success) {
        router.push("/admin/product/all");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const Checkbox = ({ label, checked, onChange }) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Product
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/admin/product/all")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Update Product
              </h1>
              <p className="text-gray-600">
                Update product information and settings
              </p>
              {title && (
                <p className="text-sm text-blue-600 mt-1">Editing: {title}</p>
              )}
            </div>
            <button
              onClick={() => router.push("/admin/product/all")}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <BasicInformation
              title={title}
              slug={slug}
              brands={brands}
              brand={brand}
              description={description}
              shortDescription={shortDescription}
              setShortDescription={setShortDescription}
              ingredient={ingredient}
              setIngredienta={setIngredient}
              usage={usage}
              setUsage={setUsage}
              benifit={benifit}
              setBenifit={setBenifit}
              setTitle={setTitle}
              setSlug={setSlug}
              setBrand={setBrand}
              setDescription={setDescription}
            />

            <CategorySection
              category={category}
              setCategory={setCategory}
              subcategory={subcategory}
              setSubcategory={setSubcategory}
              categories={categories}
              subcategories={subcategories}
              setTags={setTags}
              tags={tags}
            />

            {/* Pricing & Units */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Pricing & Units
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {units.map((unit, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={unit.unit}
                          onChange={(e) =>
                            updateUnit(index, "unit", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 1kg, 500g"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={unit.price}
                          onChange={(e) =>
                            updateUnit(index, "price", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          value={unit.discount}
                          onChange={(e) =>
                            updateUnit(index, "discount", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Final Price (₹)
                          </label>
                          <input
                            type="number"
                            value={unit.finalPrice}
                            onChange={(e) =>
                              updateUnit(index, "finalPrice", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                          />
                        </div>
                        {units.length > 1 && (
                          <button
                            onClick={() => removeUnit(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addUnit}
                  className="w-full py-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Unit
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Product Images */}
            <div className="bg-white border border-gray-200 rounded-md">
              <div className="border-b border-gray-200 p-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <h2 className="text-sm font-medium text-gray-900">
                    Product Images ({images.length}/10)
                  </h2>
                </div>
              </div>

              <div className="p-3 space-y-3">
                {images.length < 10 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-3 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="p-2 bg-gray-100 rounded-full mb-2">
                          <Upload className="w-4 h-4 text-gray-600" />
                        </div>
                        <p className="text-gray-600 text-sm mb-0.5">
                          Upload additional images
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10 images total
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-16 object-cover rounded border border-gray-200 group-hover:border-blue-300 transition-colors"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {image.isExisting && (
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                            Existing
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}

            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Product Details
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="eg: 5"
                  />
                </div>

                {/* Flags */}
                <div className="grid grid-cols-2 gap-4">
                  <Checkbox
                    label="Trending"
                    checked={isTrending}
                    onChange={() => setIsTrending(!isTrending)}
                  />

                  <Checkbox
                    label="Bestseller"
                    checked={isBestSeller}
                    onChange={() => setIsBestSeller(!isBestSeller)}
                  />

                  <Checkbox
                    label="New Launch"
                    checked={isNewLaunch}
                    onChange={() => setIsNewLaunch(!isNewLaunch)}
                  />

                  <Checkbox
                    label="Super Saver"
                    checked={isSuperSaver}
                    onChange={() => setSuperSaver(!isSuperSaver)}
                  />
                </div>
              </div>
            </div>

            {/* Return Policy */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Return Policy
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="returnable"
                    checked={returnable}
                    onChange={(e) => setReturnable(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="returnable"
                    className="ml-3 text-sm font-medium text-gray-700"
                  >
                    Product is returnable
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Policy Notes
                  </label>
                  <textarea
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Enter return policy details"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.push("/admin/product/all")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={btnLoading}
              className={`px-8 py-3 rounded-md font-medium transition-colors ${
                btnLoading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {btnLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductPage;
