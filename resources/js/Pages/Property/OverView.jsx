import React from 'react';

// 🔹 Reusable Skeleton Box
function Skeleton({ className = '' }) {
  return <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />;
}

export default function PropertyOverView({ property, isLoading = false }) {
  const displayValue = (value, fallback = '-') => (value ? value : fallback);

  return (
    <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-2xl p-10 border border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-10">
        <div>
          {isLoading ? (
            <Skeleton className="w-64 h-8 mb-3" />
          ) : (
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              {displayValue(property?.property_name, 'Unnamed Property')}
            </h2>
          )}

          {isLoading ? (
            <Skeleton className="w-80 h-5" />
          ) : (
            <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
              {displayValue(property?.description, 'No description available')}
            </p>
          )}
        </div>

        {/* Status badge */}
        <div className="mt-6 md:mt-0">
          {isLoading ? (
            <Skeleton className="w-24 h-8" />
          ) : property?.status ? (
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full border border-emerald-200 shadow">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-sm font-semibold px-4 py-2 rounded-full border border-rose-200 shadow">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Property Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {[
          { label: 'Property ID', value: property?.property_id },
          { label: 'Type', value: property?.property_type, capitalize: true },
          { label: 'Property Status', value: property?.property_status },
          {
            label: 'Currently Active',
            value: property?.status ? 'Yes' : 'No',
            color: property?.status ? 'text-green-600' : 'text-red-600'
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
          >
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{item.label}</p>
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <p
                className={`text-gray-800 font-semibold tracking-wide ${
                  item.capitalize ? 'capitalize' : ''
                } ${item.color || ''}`}
              >
                {displayValue(item.value)}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
