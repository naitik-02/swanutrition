"use client";
import React from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  FileText,
  MapPin,
  Shield,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  Crown,
  Calendar,
  Clock,
} from "lucide-react";
import { useUser } from "@/context/user";

const UserProfilePage = () => {
  const { dashUser } = useUser();

  const userData = dashUser || {
    name: "",
    email: "",
    phone: "",
    role: "",
    shopName: "",
    gstNumber: "",
    address: "",
    permissions: [],
    isActive: true,
    createdAt: "",
    lastLogin: "",
  };

  const roles = [
    {
      id: "admin",
      name: "Administrator",
      icon: Settings,
      color: "text-purple-600 bg-purple-100",
    },
    {
      id: "manager",
      name: "Manager",
      icon: BarChart3,
      color: "text-blue-600 bg-blue-100",
    },
    {
      id: "customer",
      name: "Customer",
      icon: User,
      color: "text-green-600 bg-green-100",
    },
    {
      id: "support",
      name: "Support",
      icon: Shield,
      color: "text-orange-600 bg-orange-100",
    },
    {
      id: "analyst",
      name: "Analyst",
      icon: BarChart3,
      color: "text-indigo-600 bg-indigo-100",
    },
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

    // Pages
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

  const currentRole = roles.find((role) => role.id === userData.role);
  const RoleIcon = currentRole?.icon || User;

  const userPermissions = availablePermissions.filter((permission) =>
    userData.permissions?.includes(permission.id)
  );

  const groupedUserPermissions = userPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50  ">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-sm ${
                currentRole?.color || "bg-gray-100 text-gray-600"
              }`}
            >
              <RoleIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.name || "User Profile"}
              </h1>
              <p className="text-gray-600 mt-1">
                {currentRole?.name || "User"} • View profile information and permissions
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">
                  Basic Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
                      <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">
                        {userData.name || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 font-medium break-all">
                        {userData.email || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Phone Number
                    </label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
                      <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">
                        {userData.phone || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Role
                    </label>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          currentRole?.color || "bg-gray-100"
                        }`}
                      >
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <span className="text-gray-900 font-medium">
                        {currentRole?.name || "Not assigned"}
                      </span>
                      {userData.role === "admin" && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </div>

                  {/* Shop Name (if available) */}
                  {userData.shopName && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-500">
                        Shop Name
                      </label>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
                        <Building className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">
                          {userData.shopName}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* GST Number (if available) */}
                  {userData.gstNumber && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-500">
                        GST Number
                      </label>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
                        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">
                          {userData.gstNumber}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address (if available) */}
                {userData.address && (
                  <div className="mt-6 space-y-2">
                    <label className="block text-sm font-medium text-gray-500">
                      Address
                    </label>
                    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-900 font-medium">
                        {userData.address}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">
                  Permissions & Access Rights
                </h2>
              </div>
              <div className="p-6">
                {Object.keys(groupedUserPermissions).length > 0 ? (
                  <div className="space-y-8">
                    {Object.entries(groupedUserPermissions).map(
                      ([category, permissions]) => (
                        <div key={category}>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-gray-500" />
                            {category}
                            <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {permissions.length}
                            </span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm text-gray-700 font-medium">
                                  {permission.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Permissions Assigned
                    </h3>
                    <p className="text-gray-500">
                      This user doesn't have any specific permissions assigned yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Status
                </h2>
              </div>
              <div className="p-6">
                <div className={`flex items-center justify-center p-4 rounded-lg ${
                  userData.isActive 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {userData.isActive ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                      <div className="text-center">
                        <span className="text-lg font-semibold text-green-700 block">
                          Active
                        </span>
                        <span className="text-sm text-green-600">
                          Account is active and operational
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-600 mr-3" />
                      <div className="text-center">
                        <span className="text-lg font-semibold text-red-700 block">
                          Inactive
                        </span>
                        <span className="text-sm text-red-600">
                          Account is currently inactive
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Summary
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <span className="text-gray-600 font-medium">Role:</span>
                    <span className="text-gray-900 font-semibold">
                      {currentRole?.name || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <span className="text-gray-600 font-medium">Permissions:</span>
                    <span className="text-gray-900 font-semibold">
                      {userData.permissions?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span
                      className={`font-semibold ${
                        userData.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {userData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between items-start p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <span className="text-gray-600 font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created:
                    </span>
                    <span className="text-gray-900 font-semibold text-right text-sm">
                      {formatDate(userData.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-start p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <span className="text-gray-600 font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Last Login:
                    </span>
                    <span className="text-gray-900 font-semibold text-right text-sm">
                      {formatDate(userData.lastLogin)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;