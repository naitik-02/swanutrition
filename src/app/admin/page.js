


import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Admin Dashboard 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Hello Admin! Manage your application with ease and efficiency.  
          Use the sidebar to navigate through different sections.
        </p>
        <div className="flex justify-center">
          <span className="px-6 py-2 text-sm font-medium rounded-full bg-blue-100 text-blue-600">
            You are logged in as <strong>Admin</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;
