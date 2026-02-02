// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   Save,
//   Eye,
//   FileText,
//   Image as ImageIcon,
//   Tag,
//   Calendar,
//   User,
//   Globe,
//   Lock,
//   Trash2,
//   Upload,
//   X,
//   AlertCircle,
// } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { usePostContext } from "@/context/post";
// import { usePostCategoryContext } from "@/context/postCategory";
// import { usePostSubCategoryContext } from "@/context/postSubCategory";
// import axios from "axios";
// import Loading from "@/components/loading";
// import ReactQuill from "react-quill-new";
// import "react-quill-new/dist/quill.snow.css";

// const EditBlogPost = () => {
//   const { slug } = useParams();
//   const router = useRouter();
//   const { updatePost, btnLoading, loading, setLoading } = usePostContext();
//   const { postCategories, fetchPostCategories } = usePostCategoryContext();
//   const { postSubcategories, fetchPostSubCategories } = usePostSubCategoryContext();

//   const [postData, setPostData] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     description: "",
//     excerpt: "",
//     featuredImage: "",
//     category: "",
//     subcategory: "",
//     tags: [],
//     status: "draft",
//     metaTitle: "",
//     metaDescription: "",
//     seoKeywords: "",
//     author: "",
//     publishedAt: "",
//   });

//   // UI State
//   const [currentTag, setCurrentTag] = useState("");
//   const [imagePreview, setImagePreview] = useState("");
//   const [errors, setErrors] = useState({});
//   const [activeTab, setActiveTab] = useState("description"); // description, seo, settings

//   useEffect(() => {
//     fetchPostCategories();
//     fetchPostSubCategories();
//   }, []);

//   useEffect(() => {
//     if (slug) {
//       fetchPostData();
//     }
//   }, [slug]);

//   const fetchPostData = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(`/api/Admin/posts/${slug}`, {
//         withCredentials: true,
//       });
      
//       const post = data?.data;
//       setPostData(post);
      
//       setFormData({
//         title: post.title || "",
//         slug: post.slug || "",
//         description: post.description || "",
//         excerpt: post.excerpt || "",
//         featuredImage: post.featuredImage || "",
//         category: post.category?._id || post.category || "",
//         subcategory: post.subcategory?._id || post.subcategory || "",
//         tags: post.tags || [],
//         status: post.status || "draft",
//         metaTitle: post.metaTitle || "",
//         metaDescription: post.metaDescription || "",
//         seoKeywords: post.seoKeywords || "",
//         author: post.author || "",
//         publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "",
//       });
      
//       setImagePreview(post.featuredImage || "");
//     } catch (error) {
//       console.error("Failed to fetch post:", error);
//       alert("Failed to load post data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
    
//     // Auto-generate slug from title
//     if (name === "title") {
//       const autoSlug = value
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/(^-|-$)/g, "");
//       setFormData((prev) => ({
//         ...prev,
//         slug: autoSlug,
//       }));
//     }
//   };

//   const handledescriptionChange = (description) => {
//     setFormData((prev) => ({
//       ...prev,
//       description: description,
//     }));
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       alert("Please select a valid image file");
//       return;
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert("Image size should be less than 5MB");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result);
//       setFormData((prev) => ({
//         ...prev,
//         featuredImage: reader.result,
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const removeImage = () => {
//     setImagePreview("");
//     setFormData((prev) => ({
//       ...prev,
//       featuredImage: "",
//     }));
//   };

//   const handleAddTag = () => {
//     if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
//       setFormData((prev) => ({
//         ...prev,
//         tags: [...prev.tags, currentTag.trim()],
//       }));
//       setCurrentTag("");
//     }
//   };

//   const handleRemoveTag = (tagToRemove) => {
//     setFormData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((tag) => tag !== tagToRemove),
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.title.trim()) {
//       newErrors.title = "Title is required";
//     }

//     if (!formData.slug.trim()) {
//       newErrors.slug = "Slug is required";
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = "description is required";
//     }

//     if (!formData.category) {
//       newErrors.category = "Category is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (status = formData.status) => {
//     if (!validateForm()) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     try {
//       const submitData = {
//         ...formData,
//         status: status,
//       };

//       await updatePost(postData._id, submitData);
//       alert("Post updated successfully!");
//       router.push("/admin/post");
//     } catch (error) {
//       console.error("Error updating post:", error);
//       alert("Failed to update post. Please try again.");
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
//       return;
//     }

//     try {
//       await axios.delete(`/api/Admin/posts/${postData._id}`, {
//         withCredentials: true,
//       });
//       alert("Post deleted successfully!");
//       router.push("/admin/post");
//     } catch (error) {
//       console.error("Error deleting post:", error);
//       alert("Failed to delete post");
//     }
//   };

//   const filteredSubcategories = postSubcategories?.filter(
//     (sub) => sub.parentCategory._id === formData.category
//   );

//   if (loading || !postData) {
//     return <Loading />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => router.push("/admin/post")}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-semibold text-gray-900">
//                   Edit Blog Post
//                 </h1>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Update your blog post • /{formData.slug}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => window.open(`/blog/${postData.slug}`, "_blank")}
//                 className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
//               >
//                 <Eye size={16} />
//                 Preview
//               </button>
//               <button
//                 onClick={() => handleSubmit("draft")}
//                 disabled={btnLoading}
//                 className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
//               >
//                 Save as Draft
//               </button>
//               <button
//                 onClick={() => handleSubmit("published")}
//                 disabled={btnLoading}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
//               >
//                 {btnLoading ? (
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 ) : (
//                   <Save size={16} />
//                 )}
//                 Update & Publish
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="py-6">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Main description Area */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Tabs */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                 <div className="border-b border-gray-200">
//                   <div className="flex">
//                     <button
//                       onClick={() => setActiveTab("description")}
//                       className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//                         activeTab === "description"
//                           ? "border-blue-600 text-blue-600"
//                           : "border-transparent text-gray-600 hover:text-gray-900"
//                       }`}
//                     >
//                       <FileText size={16} className="inline mr-2" />
//                       description
//                     </button>
//                     <button
//                       onClick={() => setActiveTab("seo")}
//                       className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//                         activeTab === "seo"
//                           ? "border-blue-600 text-blue-600"
//                           : "border-transparent text-gray-600 hover:text-gray-900"
//                       }`}
//                     >
//                       <Globe size={16} className="inline mr-2" />
//                       SEO
//                     </button>
//                     <button
//                       onClick={() => setActiveTab("settings")}
//                       className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
//                         activeTab === "settings"
//                           ? "border-blue-600 text-blue-600"
//                           : "border-transparent text-gray-600 hover:text-gray-900"
//                       }`}
//                     >
//                       <Lock size={16} className="inline mr-2" />
//                       Settings
//                     </button>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   {/* description Tab */}
//                   {activeTab === "description" && (
//                     <div className="space-y-6">
//                       {/* Title */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Post Title *
//                         </label>
//                         <input
//                           type="text"
//                           name="title"
//                           value={formData.title}
//                           onChange={handleInputChange}
//                           placeholder="Enter your blog post title"
//                           className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg ${
//                             errors.title ? "border-red-500" : "border-gray-300"
//                           }`}
//                         />
//                         {errors.title && (
//                           <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                             <AlertCircle size={14} />
//                             {errors.title}
//                           </p>
//                         )}
//                       </div>

//                       {/* Slug */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           URL Slug *
//                         </label>
//                         <div className="flex items-center gap-2">
//                           <span className="text-gray-500 text-sm">/blog/</span>
//                           <input
//                             type="text"
//                             name="slug"
//                             value={formData.slug}
//                             onChange={handleInputChange}
//                             placeholder="post-url-slug"
//                             className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                               errors.slug ? "border-red-500" : "border-gray-300"
//                             }`}
//                           />
//                         </div>
//                         {errors.slug && (
//                           <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                             <AlertCircle size={14} />
//                             {errors.slug}
//                           </p>
//                         )}
//                       </div>

//                       {/* Excerpt */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Excerpt
//                         </label>
//                         <textarea
//                           name="excerpt"
//                           value={formData.excerpt}
//                           onChange={handleInputChange}
//                           placeholder="Brief description of your post..."
//                           rows={3}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>

//                       {/* description Editor */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           description *
//                         </label>
//                         <ReactQuill
//                           theme="snow"
//                           value={formData.description}
//                           onChange={handledescriptionChange}
//                           modules={{
//                             toolbar: [
//                               [{ header: [1, 2, 3, 4, 5, 6, false] }],
//                               ["bold", "italic", "underline", "strike"],
//                               [{ color: [] }, { background: [] }],
//                               [{ list: "ordered" }, { list: "bullet" }],
//                               [{ indent: "-1" }, { indent: "+1" }],
//                               [{ align: [] }],
//                               ["link", "image", "video"],
//                               ["blockquote", "code-block"],
//                               ["clean"],
//                             ],
//                           }}
//                           className={`bg-white ${
//                             errors.description ? "border-2 border-red-500 rounded-lg" : ""
//                           }`}
//                           style={{ minHeight: "400px" }}
//                         />
//                         {errors.description && (
//                           <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                             <AlertCircle size={14} />
//                             {errors.description}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* SEO Tab */}
//                   {activeTab === "seo" && (
//                     <div className="space-y-6">
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                         <p className="text-sm text-blue-800">
//                           <strong>SEO Tip:</strong> Optimize your post for search engines
//                           by providing relevant meta information. This helps improve
//                           visibility in search results.
//                         </p>
//                       </div>

//                       {/* SEO Title */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           SEO Title
//                         </label>
//                         <input
//                           type="text"
//                           name="metaTitle"
//                           value={formData.metaTitle}
//                           onChange={handleInputChange}
//                           placeholder="SEO optimized title (50-60 characters)"
//                           maxLength={60}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                           {formData.metaTitle.length}/60 characters
//                         </p>
//                       </div>

//                       {/* SEO Description */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Meta Description
//                         </label>
//                         <textarea
//                           name="metaDescription"
//                           value={formData.metaDescription}
//                           onChange={handleInputChange}
//                           placeholder="Brief description for search engines (150-160 characters)"
//                           rows={3}
//                           maxLength={160}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                           {formData.metaDescription.length}/160 characters
//                         </p>
//                       </div>

//                       {/* SEO Keywords */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Focus Keywords
//                         </label>
//                         <input
//                           type="text"
//                           name="seoKeywords"
//                           value={formData.seoKeywords}
//                           onChange={handleInputChange}
//                           placeholder="keyword1, keyword2, keyword3"
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                           Comma-separated keywords
//                         </p>
//                       </div>

//                       {/* SEO Preview */}
//                       <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
//                         <h4 className="text-sm font-medium text-gray-700 mb-3">
//                           Search Engine Preview
//                         </h4>
//                         <div className="space-y-1">
//                           <div className="text-blue-600 text-lg">
//                             {formData.metaTitle || formData.title || "Your Post Title"}
//                           </div>
//                           <div className="text-green-600 text-sm">
//                             yoursite.com/blog/{formData.slug || "post-slug"}
//                           </div>
//                           <div className="text-gray-600 text-sm">
//                             {formData.metaDescription ||
//                               formData.excerpt ||
//                               "Your post description will appear here..."}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Settings Tab */}
//                   {activeTab === "settings" && (
//                     <div className="space-y-6">
//                       {/* Author */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           <User size={16} className="inline mr-2" />
//                           Author Name
//                         </label>
//                         <input
//                           type="text"
//                           name="author"
//                           value={formData.author}
//                           onChange={handleInputChange}
//                           placeholder="Enter author name"
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>

//                       {/* Publish Date */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           <Calendar size={16} className="inline mr-2" />
//                           Publish Date
//                         </label>
//                         <input
//                           type="datetime-local"
//                           name="publishedAt"
//                           value={formData.publishedAt}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>

//                       {/* Status */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Post Status
//                         </label>
//                         <select
//                           name="status"
//                           value={formData.status}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         >
//                           <option value="draft">Draft</option>
//                           <option value="published">Published</option>
//                           <option value="private">Private</option>
//                         </select>
//                       </div>

//                       {/* Delete Post */}
//                       <div className="pt-6 border-t border-gray-200">
//                         <h4 className="text-sm font-medium text-gray-900 mb-3">
//                           Danger Zone
//                         </h4>
//                         <button
//                           onClick={handleDelete}
//                           className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
//                         >
//                           <Trash2 size={16} />
//                           Delete Post Permanently
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar */}
//             <div className="lg:col-span-1 space-y-6">
//               {/* Featured Image */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <ImageIcon size={18} />
//                   Featured Image
//                 </h3>
//                 {imagePreview ? (
//                   <div className="relative">
//                     <img
//                       src={imagePreview}
//                       alt="Featured"
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                     <button
//                       onClick={removeImage}
//                       className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
//                     >
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="block cursor-pointer">
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
//                       <Upload size={32} className="mx-auto text-gray-400 mb-2" />
//                       <p className="text-sm text-gray-600">
//                         Click to upload image
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         PNG, JPG up to 5MB
//                       </p>
//                     </div>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                     />
//                   </label>
//                 )}
//               </div>

//               {/* Categories */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <FileText size={18} />
//                   Categories *
//                 </h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Main Category
//                     </label>
//                     <select
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                         errors.category ? "border-red-500" : "border-gray-300"
//                       }`}
//                     >
//                       <option value="">Select category</option>
//                       {postCategories?.map((cat) => (
//                         <option key={cat._id} value={cat._id}>
//                           {cat.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {formData.category && filteredSubcategories?.length > 0 && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Subcategory
//                       </label>
//                       <select
//                         name="subcategory"
//                         value={formData.subcategory}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="">Select subcategory</option>
//                         {filteredSubcategories.map((sub) => (
//                           <option key={sub._id} value={sub._id}>
//                             {sub.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Tags */}
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                 <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <Tag size={18} />
//                   Tags
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={currentTag}
//                       onChange={(e) => setCurrentTag(e.target.value)}
//                       onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
//                       placeholder="Add tag..."
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                     <button
//                       onClick={handleAddTag}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     >
//                       Add
//                     </button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {formData.tags.map((tag, index) => (
//                       <span
//                         key={index}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//                       >
//                         #{tag}
//                         <button
//                           onClick={() => handleRemoveTag(tag)}
//                           className="hover:text-blue-900"
//                         >
//                           <X size={14} />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Post Info */}
//               <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
//                 <h4 className="font-medium text-gray-900 mb-3">Post Info</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Status:</span>
//                     <span className="font-medium capitalize">{formData.status}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Created:</span>
//                     <span className="font-medium">
//                       {new Date(postData.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                   {postData.updatedAt && (
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Updated:</span>
//                       <span className="font-medium">
//                         {new Date(postData.updatedAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditBlogPost;