"use client";

import { useState } from "react";

const Selecttabs = ({ subs, onSelect, selected, setSelected }) => {
  const defaultTabs = [
    { name: "All", slug: "" },
    { name: "Multivitamins", slug: "multivitamins" },
    { name: "Gummies", slug: "gummies" },
    { name: "Powder", slug: "powder" },
  ];
  const tabs =
    subs && subs.length > 0
      ? [{ name: "All", slug: "" }, ...subs]
      : defaultTabs;

  const handleSelect = (index) => {
    setSelected(index);
    if (onSelect) {
      onSelect(tabs[index]);
    }
  };

  return (
    <div className="w-full   overflow-x-scroll mx-auto">
      <div className="relative bg-gray-50 rounded-2xl p-1.5 shadow-inner">
        <div className="flex gap-2 relative">
          {tabs.map((sub, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`
                relative flex-1 px-6 py-2 rounded-xl font-semibold text-xs
                transition-all duration-300 ease-out
                ${
                  selected === index
                    ? "text-white shadow-lg scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }
              `}
            >
              {selected === index && (
                <span className="absolute inset-0 bg-slate-900 rounded-xl -z-10" />
              )}
              <span className="relative z-10">{sub.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Selecttabs;
