"use client";
import React, { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  Shield,
  User,
  Settings,
  BarChart3,
  Eye,
  EyeOff,
  ChevronDown,
  Home,
} from "lucide-react";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import Link from "next/link";

const DashboardLogin = () => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const {
    dashboardLogin,
    btnLoading,

    dashUser,

    isDashAuth,
    adminLoading,
  } = useUser();

  const roles = [
    { id: "admin", name: "Administrator", icon: Settings },
    { id: "manager", name: "Manager", icon: BarChart3 },
    { id: "user", name: "User", icon: User },
   
  ];

  

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    await dashboardLogin(email, password, selectedRole, router);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };



  const selectedRoleData = roles.find((r) => r.id === selectedRole);
  const SelectedIcon = selectedRoleData?.icon;

  if (adminLoading) return <Loading />;


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
     <Link
        href="/" 
        className="fixed top-4 left-4 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
      >
        <Home className="w-5 h-5 text-gray-600" />
      </Link>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard Login
          </h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {SelectedIcon && (
                    <SelectedIcon className="w-4 h-4 text-gray-600" />
                  )}
                  <span className="text-sm text-gray-900">
                    {selectedRoleData?.name}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    showRoleDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showRoleDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <button
                        key={role.id}
                        onClick={() => {
                          setSelectedRole(role.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                          selectedRole === role.id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-900"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm">{role.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="admin2@gmail.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="admin2"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={!email || !password || btnLoading}
                className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
              >
                {btnLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in to Dashboard"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogin;
