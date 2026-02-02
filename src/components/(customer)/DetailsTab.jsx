"use client";

import { useState } from "react";

const DetailsTab = ({ product }) => {
  const allTabs = [
    { label: "Description", value: product?.description },
    { label: "Benefits", value: product?.benefit },
    { label: "Ingredient", value: product?.ingredient },
    { label: "Usage", value: product?.usage },
  ];
  const tabs = allTabs.filter(
    (tab) => typeof tab.value === "string" && tab.value.trim() !== "",
  );
  const [selected, setSelected] = useState(0);

  console.log(product);

  const renderContent = () => {
    switch (selected) {
      case 0:
        return product?.description;
      case 1:
        return product?.benefit;
      case 2:
        return product?.ingredient;
      case 3:
        return product?.usage;
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative bg-gray-100 rounded-2xl p-1.5  shadow-inner">
        <div className="flex gap-2 relative">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`relative flex-1 px-6 py-2 rounded-xl font-semibold text-xs
                transition-all duration-300 ease-out
                ${
                  selected === index
                    ? "text-white shadow-lg scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
            >
              {selected === index && (
                <span className="absolute inset-0 bg-slate-900 rounded-xl -z-10" />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="mt-4 product-details-content"
        dangerouslySetInnerHTML={{
          __html: renderContent() || "<p>No data available.</p>",
        }}
      />

      <style jsx global>{`
        .product-details-content {
          font-size: 14px;
          line-height: 1.75;
          color: #334155;
          background-color: #f4f3f0;
          padding: 16px;
          border-radius: 12px;
        }

        .product-details-content p {
          margin-bottom: 14px;
        }

        .product-details-content ul {
          margin: 16px 0;
          padding-left: 0;
        }

        .product-details-content li {
          list-style: none;
          position: relative;
          padding-left: 36px;
          margin-bottom: 14px;
          display: flex;
          align-items: flex-start;
        }

        /* ICON */
        .product-details-content li::before {
          content: "✓";
          position: absolute;
          left: 0;
          top: 2px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0f172a, #334155);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(15, 23, 42, 0.25);
        }

        .product-details-content strong {
          color: #0f172a;
          font-weight: 600;
        }

        /* Mobile polish */
        @media (max-width: 640px) {
          .product-details-content {
            font-size: 13px;
          }

          .product-details-content li {
            margin-bottom: 12px;
            padding-left: 32px;
          }

          .product-details-content li::before {
            width: 20px;
            height: 20px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailsTab;
