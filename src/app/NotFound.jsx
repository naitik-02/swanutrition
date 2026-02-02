"use client";

import Link from "next/link";
import { useEffect } from "react";
import { XCircle } from "lucide-react";

export default function PageNotFound() {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div className="flex items-center justify-center h-[400px] md:h-[500px]  ">
      <div className="text-center">
        <XCircle className="mx-auto h-14 w-14 text-red-500" />
        <h1 className="mt-6 text-lg font-extrabold text-gray-800">404</h1>
        <p className="mt-2 text-sm text-gray-600">
          Oops! The page you are looking for does not exist.
        </p>
        <p className="mt-1 text-gray-500">
          It might have been moved or deleted.
        </p>
        <Link href="/">
          <button className=" cursor-pointer mt-6 text-xs inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
}
