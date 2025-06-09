import React from 'react';

export default function Transactions({ transactions, isLoading = false }) {
  // shimmer placeholder count
  const shimmerCount = 5;

  // Helper to safely format date or fallback
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return '-';
    }
  };

  // Helper to safely format amount or fallback
  const formatAmount = (amount, currency) => {
    if (amount == null || isNaN(amount)) return '-';
    return `${currency || ''} ${amount.toLocaleString()}`;
  };

  // Normalize status to lowercase or fallback
  const getStatusClasses = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {['Date', 'Type', 'Amount', 'Status', 'Reference'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 font-semibold text-gray-600 tracking-wider uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Loading shimmer rows */}
            {isLoading &&
              [...Array(shimmerCount)].map((_, i) => (
                <tr key={`shimmer-${i}`} className="border-b last:border-0">
                  {[...Array(5)].map((__, idx) => (
                    <td key={idx} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-full max-w-[100px]"></div>
                    </td>
                  ))}
                </tr>
              ))}

            {/* Empty state */}
            {!isLoading && (!transactions || transactions.length === 0) && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500 italic select-none">
                  No transactions found.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading &&
              transactions?.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {formatDate(txn.transaction_date)}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-700 font-medium">
                    {txn.transaction_type || '-'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {formatAmount(txn.amount, txn.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(
                        txn.status
                      )}`}
                    >
                      {txn.status || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-600 underline cursor-pointer truncate max-w-[150px]">
                    {txn.reference_id || '-'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
