import React from 'react';

function Skeleton({ className = '' }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

export default function PropertyLocationView({ property, isLoading = false }) {
  const display = (val) => val || '-';

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        Location
      </h2>

      <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
        {/* Address */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md">
          <p className="text-gray-500 text-xs uppercase mb-1">Address</p>
          {isLoading ? (
            <Skeleton className="w-3/4 h-4" />
          ) : (
            <p>
              {[
                display(property?.address_line_1),
                property?.address_line_2,
                display(property?.city),
                display(property?.state),
                display(property?.postal_code),
                display(property?.country),
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
        </div>

        {/* Coordinates */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md">
          <p className="text-gray-500 text-xs uppercase mb-1">Coordinates</p>
          {isLoading ? (
            <Skeleton className="w-40 h-4" />
          ) : (
            <p className="text-gray-800 font-medium">
              {property?.latitude || '-'}, {property?.longitude || '-'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
