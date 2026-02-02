import React from "react";

const CategoryDescription = ({ content }) => {
  return (
    <div className="bg-white rounded-xl mt-10 mb-10">
      <div
        className="content-section prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx>{`
        .content-section {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #374151;
          line-height: 1.7;
        }

        .content-section h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .content-section h3 {
          font-size: 1.375rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .content-section p {
          margin-bottom: 1.5rem;
          color: #4b5563;
        }

        .content-section ul {
          list-style: none;
          padding-left: 0;
          margin: 1.5rem 0;
        }

        .content-section li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: #4b5563;
        }

        .content-section li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .content-section strong {
          color: #1f2937;
          font-weight: 600;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CategoryDescription;
