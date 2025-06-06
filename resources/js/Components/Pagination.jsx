// Pagination.jsx
import React from 'react';

export default function Pagination({
  currentPage,
  lastPage,
  perPage,
  perPageOptions = [1, 5, 10, 15, 20],
  onPageChange,
  onPerPageChange,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between ${className} space-y-4 sm:space-y-0`}>
      {/* Per page selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="perPage" className="font-medium text-gray-700">
          Show:
        </label>
        <select
          id="perPage"
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {perPageOptions.map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
        <span className="text-gray-600 text-sm">per page</span>
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center space-x-3">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium text-sm">
          Page {currentPage} of {lastPage}
        </span>

        <button
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
