"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Save,
  Settings,
  BarChart3,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useUser } from "@/context/user";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Loading from "@/components/loading";

const UpdateUserPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    shopName: "",
    gstNumber: "",
    address: "",
    permissions: [],
    isActive: true,
  });

  const { btnLoading, updateUser, dashUser, getUserById } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const roles = [
    { id: "admin", name: "Administrator", icon: Settings },
    { id: "manager", name: "Manager", icon: BarChart3 },
    { id: "customer", name: "Customer", icon: User },
  ];

  const availablePermissions = [
    // Dashboard
    { id: "view_dashboard", name: "View Dashboard", category: "Dashboard" },

    // Posts
    { id: "view_posts", name: "View Posts", category: "Posts" },
    { id: "create_posts", name: "Create Posts", category: "Posts" },
    { id: "update_posts", name: "Update Posts", category: "Posts" },
    { id: "delete_posts", name: "Delete Posts", category: "Posts" },
    {
      id: "manage_post_categories",
      name: "Manage Post Categories",
      category: "Posts",
    },
    { id: "manage_post_tags", name: "Manage Post Tags", category: "Posts" },

    // pages
    { id: "view_pages", name: "View Pages", category: "Pages" },
    { id: "add_page", name: "Add Page", category: "Pages" },
    { id: "update_page", name: "Update Page", category: "Pages" },
    { id: "delete_page", name: "Delete Page", category: "Pages" },

    // Products
    { id: "view_products", name: "View Products", category: "Products" },
    { id: "create_products", name: "Create Products", category: "Products" },
    { id: "update_products", name: "Update Products", category: "Products" },
    { id: "delete_products", name: "Delete Products", category: "Products" },
    {
      id: "manage_product_categories",
      name: "Manage Product Categories",
      category: "Products",
    },
    { id: "manage_brands", name: "Manage Brands", category: "Products" },
    {
      id: "manage_attributes",
      name: "Manage Attributes",
      category: "Products",
    },
    {
      id: "manage_product_tags",
      name: "Manage Product Tags",
      category: "Products",
    },
    { id: "manage_reviews", name: "Manage Reviews", category: "Products" },

    // CMS
    { id: "view_cms", name: "View CMS", category: "CMS" },
    { id: "update_cms_hero", name: "Update CMS Hero Section", category: "CMS" },
    { id: "update_cms_faqs", name: "Update CMS FAQs", category: "CMS" },

    // Settings
    {
      id: "manage_general_settings",
      name: "Manage General Settings",
      category: "Settings",
    },
    {
      id: "manage_media_settings",
      name: "Manage Media Settings",
      category: "Settings",
    },
    {
      id: "manage_permalink_settings",
      name: "Manage Permalink Settings",
      category: "Settings",
    },

    // Users
    { id: "view_users", name: "View Users", category: "Users" },
    { id: "create_users", name: "Create Users", category: "Users" },
    { id: "update_users", name: "Update Users", category: "Users" },
    { id: "delete_users", name: "Delete Users", category: "Users" },

    // Orders
    { id: "view_orders", name: "View Orders", category: "Orders" },
    { id: "update_orders", name: "Update Orders", category: "Orders" },
    { id: "delete_orders", name: "Delete Orders", category: "Orders" },

    // E-Commerce
    {
      id: "manage_ecommerce_general",
      name: "Manage E-Commerce General Settings",
      category: "E-Commerce",
    },
    {
      id: "manage_ecommerce_products",
      name: "Manage E-Commerce Products",
      category: "E-Commerce",
    },
    {
      id: "manage_payments",
      name: "Manage Payment Settings",
      category: "E-Commerce",
    },
    {
      id: "manage_email_settings",
      name: "Manage Email Settings",
      category: "E-Commerce",
    },
    {
      id: "manage_account_privacy",
      name: "Manage Account & Privacy",
      category: "E-Commerce",
    },
    {
      id: "manage_visibility",
      name: "Manage Visibility Settings",
      category: "E-Commerce",
    },

    // Activities
    {
      id: "view_activities",
      name: "View Recent Activities",
      category: "Activity",
    },
    {
      id: "delete_activities",
      name: "Delete Activities",
      category: "Activity",
    },
  ];

  const fetchSingleUser = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/Admin/user/${id}`, {
        withCredentials: true,
      });
      return data?.user || null;
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to fetch user");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) {
        setUserNotFound(true);
        setLoading(false);
        return;
      }

      const fetchedUser = await fetchSingleUser(userId);

      if (fetchedUser) {
        setUserData(fetchedUser);
        setFormData({
          name: fetchedUser.name || "",
          email: fetchedUser.email || "",
          password: "",
          phone: fetchedUser.phone || "",
          role: fetchedUser.role || "",
          shopName: fetchedUser.shopName || "",
          gstNumber: fetchedUser.gstNumber || "",
          address: fetchedUser.address || "",
          permissions: fetchedUser.permissions || [],
          isActive:
            fetchedUser.isActive !== undefined ? fetchedUser.isActive : true,
        });
        setUserNotFound(false);
      } else {
        setUserNotFound(true);
      }
    };

    loadUserData();
  }, [userId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = ["name", "email", "phone", "role"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (!formData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const updateData = { ...formData };
    if (!formData.password) {
      delete updateData.password;
    }

    await updateUser(userId, updateData);
    
  };

  const handleGoBack = () => {
    router.back();
  };

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // User not found state
  if (userNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            User Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The user you're trying to update doesn't exist or you don't have
            permission to access it.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  // Helper component for disabled field indicator
  const DisabledIndicator = () => (
    <div className="flex items-center space-x-2 mt-1">
      <AlertCircle className="w-4 h-4 text-amber-500" />
      <span className="text-xs text-amber-600">Only allowed to admin</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Update User Profile
              </h1>
              <p className="text-gray-600">
                Modify user information and permissions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Leave blank to keep current password"
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to keep current password
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      maxLength="10"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange(
                          "phone",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      placeholder="Enter phone number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    disabled={dashUser?.role !== "admin"}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      dashUser?.role !== "admin"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {dashUser?.role !== "admin" && <DisabledIndicator />}
                </div>
              </div>
            </div>

          
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Permissions
                </h2>
                {dashUser?.role !== "admin" && (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-amber-600">
                      Admin access required
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {dashUser?.role !== "admin"
                  ? "Contact an administrator to modify permissions"
                  : "Select the permissions this user should have"}
              </p>

              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(
                  ([category, permissions]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => (
                          <label
                            key={permission.id}
                            className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg transition-colors ${
                              dashUser?.role !== "admin"
                                ? "bg-gray-50 cursor-not-allowed"
                                : "hover:bg-gray-50 cursor-pointer"
                            }`}
                          >
                            <input
                              type="checkbox"
                              disabled={dashUser?.role !== "admin"}
                              checked={formData.permissions.includes(
                                permission.id
                              )}
                              onChange={() =>
                                handlePermissionToggle(permission.id)
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                            />
                            <span
                              className={`text-sm ${
                                dashUser?.role !== "admin"
                                  ? "text-gray-500"
                                  : "text-gray-700"
                              }`}
                            >
                              {permission.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
           
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                User Status
              </h2>
              <div className="space-y-4">
                <label
                  className={`flex items-center space-x-3 ${
                    dashUser?.role !== "admin"
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={dashUser?.role !== "admin"}
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:cursor-not-allowed"
                  />
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        dashUser?.role !== "admin"
                          ? "text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      Active User
                    </span>
                    <p className="text-xs text-gray-500">
                      User can login and access the system
                    </p>
                  </div>
                </label>
                {dashUser?.role !== "admin" && <DisabledIndicator />}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="text-gray-900 font-medium">
                    {formData.role
                      ? roles.find((r) => r.id === formData.role)?.name
                      : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Permissions:</span>
                  <span className="text-gray-900 font-medium">
                    {formData.permissions.length} selected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      formData.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                onClick={handleSubmit}
                disabled={btnLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center mb-3"
              >
                {btnLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Update Profile
                  </>
                )}
              </button>

              <button
                onClick={handleGoBack}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Cancel & Go Back
              </button>

              <p className="text-xs text-gray-500 text-center mt-2">
                Changes will be saved to the user profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserPage;
