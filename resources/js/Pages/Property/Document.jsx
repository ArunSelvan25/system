import React from 'react';

export default function PropertyDocumentView({ documents, isLoading = false }) {
  const shimmerItems = Array.from({ length: 4 });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
        Documents
      </h3>

      {isLoading ? (
        <ul className="space-y-4">
          {shimmerItems.map((_, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 animate-pulse bg-gray-100 rounded-md p-3"
              aria-busy="true"
              aria-label="Loading document"
            >
              <div className="w-6 h-6 bg-gray-300 rounded-sm flex-shrink-0" />
              <div className="h-5 bg-gray-300 rounded w-48" />
            </li>
          ))}
        </ul>
      ) : documents?.length ? (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 bg-white rounded-md p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <svg
                className="w-6 h-6 text-blue-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                role="img"
                aria-label="Document icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H9l-2-2H7a2 2 0 00-2 2v9a2 2 0 002 2z"
                />
              </svg>

              {doc.path ? (
                <a
                  href={doc.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium truncate max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  title={doc.document_type || 'Document'}
                >
                  {doc.document_type || 'Untitled Document'}
                </a>
              ) : (
                <span className="text-gray-400 italic">Invalid or missing document</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 italic py-6 text-center border border-dashed border-gray-300 rounded-md">
          No documents available.
        </div>
      )}
    </div>
  );
}
