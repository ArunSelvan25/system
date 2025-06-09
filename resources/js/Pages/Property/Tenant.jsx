import React from 'react';

export default function Tenant({ tenants, isLoading = false }) {
  const shimmerCount = 5;

  const getInitials = (name) => {
    if (!name) return '-';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Tenants</h2>

      {isLoading || !tenants ? (
        <ul className="divide-y divide-gray-200">
          {[...Array(shimmerCount)].map((_, i) => (
            <li
              key={i}
              className="py-4 flex items-center justify-between rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded" />
              </div>

              <div className="flex space-x-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-gray-200 animate-pulse w-20 h-6" />
                <span className="self-center text-transparent">—</span>
                <span className="px-3 py-1 rounded-full bg-gray-200 animate-pulse w-20 h-6" />
              </div>
            </li>
          ))}
        </ul>
      ) : tenants.length === 0 ? (
        <div className="text-center py-12 text-gray-500 italic select-none">
          No tenants found.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tenants.map((t) => (
            <li
              key={t.id}
              className="py-4 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm uppercase select-none">
                  {getInitials(t.user?.name)}
                </div>
                <span className="text-gray-800 font-medium">{t.user?.name || '-'}</span>
              </div>

              <div className="flex space-x-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                  {formatDate(t.start_date)}
                </span>
                <span className="self-center text-gray-400">—</span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                  {t.end_date ? formatDate(t.end_date) : 'Present'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
