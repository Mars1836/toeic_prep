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
      <div className="flex items-center space-x-2 mb-6">
        <button className="text-lg font-semibold">☰ NGHE CHIÉP</button>
      </div>

      <nav className="space-y-2 mb-6">
        <a
          href="#"
          className="block text-blue-400 hover:bg-accent px-4 py-2 rounded"
        >
          TOEIC
        </a>
        <a
          href="#"
          className="block text-foreground hover:bg-accent px-4 py-2 rounded"
        >
          IELTS
        </a>
        <a
          href="#"
          className="block text-foreground hover:bg-accent px-4 py-2 rounded"
        >
          APTIS
        </a>
      </nav>

      <div className="space-y-4">
        <h2 className="text-blue-400 text-lg">Bộ lọc</h2>
        <div className="space-y-2">
          <div
            className="flex items-center justify-between hover:bg-accent px-4 py-2 rounded cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>PROGRAM</span>
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
                  name="review2024"
                  onChange={handleFilterChange}
                />
                <span>Đề review 2024</span>
              </label>
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
    </div>
  );
}
