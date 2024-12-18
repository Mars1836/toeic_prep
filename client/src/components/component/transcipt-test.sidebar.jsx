"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function TranscriptTestSidebar({ onFilterChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (event) => {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const selectedFilters = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.name);
    onFilterChange(selectedFilters);
  };

  return (
    <div className="w-64 bg-background border-r h-screen p-4">
      <div className=" mb-6  font-semibold justify-center">
        <div
          className="flex items-center justify-between hover:bg-accent px-4 py-2 rounded cursor-pointer text-primary text-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Bộ lọc</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
        {isExpanded && (
          <div className="ml-4 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox"
                name="part1"
                onChange={handleFilterChange}
              />
              <span>Part 1</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox"
                name="part2"
                onChange={handleFilterChange}
              />
              <span>Part 2</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox"
                name="part3"
                onChange={handleFilterChange}
              />
              <span>Part 3</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox"
                name="part4"
                onChange={handleFilterChange}
              />
              <span>Part 4</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
